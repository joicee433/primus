import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk";
import type { BadgeTemplate, ProofRecord } from "./types";
import { isPlaceholderTemplate } from "./templates";

// Get your appId/appSecret by creating a project in the Primus Developer
// Hub: https://dev.primuslabs.xyz. Never ship appSecret to a public
// frontend in production — request-signing should move to a small backend
// once you're past prototyping. See README.md.
const APP_ID = import.meta.env.VITE_PRIMUS_APP_ID as string | undefined;
const APP_SECRET = import.meta.env.VITE_PRIMUS_APP_SECRET as string | undefined;

let sdk: PrimusZKTLS | null = null;
let initPromise: Promise<PrimusZKTLS> | null = null;

export class PrimusNotConfiguredError extends Error {}
export class PrimusExtensionMissingError extends Error {}

function isConfigured() {
  return Boolean(APP_ID && APP_SECRET);
}

async function getSdk(): Promise<PrimusZKTLS> {
  if (sdk) return sdk;
  if (!isConfigured()) {
    throw new PrimusNotConfiguredError(
      "Set VITE_PRIMUS_APP_ID and VITE_PRIMUS_APP_SECRET (see README) to enable live proofs."
    );
  }
  if (!initPromise) {
    initPromise = (async () => {
      const instance = new PrimusZKTLS();
      const initResult = await instance.init(APP_ID!, APP_SECRET!);
      // eslint-disable-next-line no-console
      console.log("[primus] init result", initResult);
      sdk = instance;
      return instance;
    })();
  }
  return initPromise;
}

/** True once appId/appSecret are configured. Doesn't guarantee the browser
 * extension is installed — that failure surfaces when startAttestation runs. */
export const primusConfigured = isConfigured;

export interface RunAttestationOptions {
  template: BadgeTemplate;
  recipient: string; // wallet address or free-text handle to bind the proof to
}

/**
 * Runs a full zkTLS attestation for a template: builds the request, opens
 * the Primus Chrome extension for the user to authorize data capture, then
 * verifies the returned proof's signature client-side.
 */
export async function runLiveAttestation({
  template,
  recipient,
}: RunAttestationOptions): Promise<ProofRecord> {
  if (isPlaceholderTemplate(template)) {
    throw new PrimusNotConfiguredError(
      `"${template.name}" doesn't have a real Primus template ID yet — add one in src/lib/templates.ts.`
    );
  }

  const zktls = await getSdk();

  const request = zktls.generateRequestParams(template.primusTemplateId, recipient);
  request.setAttMode({ algorithmType: "proxytls", resultType: "plain" });

  const requestStr = request.toJsonString();
  // NOTE: signing with appSecret in the browser is only OK for local
  // testing. Move this call to a backend endpoint before shipping —
  // see the warning in README.md.
  const signedRequestStr = await zktls.sign(requestStr);

  let attestation;
  try {
    attestation = await zktls.startAttestation(signedRequestStr);
  } catch (err) {
    const message = String(err instanceof Error ? err.message : err);
    if (/extension|not installed|not found/i.test(message)) {
      throw new PrimusExtensionMissingError(
        "The Primus Chrome extension isn't installed or didn't respond."
      );
    }
    throw err;
  }

  const verified = await zktls.verifyAttestation(attestation);
  if (verified !== true) {
    throw new Error("Attestation signature failed verification.");
  }

  const data = extractAttestationData(attestation, template.displayField);
  const attestationHash = extractSignatureFragment(attestation);

  return {
    id: crypto.randomUUID(),
    templateId: template.id,
    templateName: template.name,
    issuer: template.issuer,
    headline: template.headline,
    seal: template.seal,
    accent: template.accent,
    value: data,
    recipient,
    attestation,
    attestationHash,
    issuedAt: new Date().toISOString(),
    mode: "live",
  };
}

function extractAttestationData(attestation: unknown, field: string): string {
  try {
    const att = attestation as { data?: string };
    if (!att?.data) return "verified";
    const parsed = JSON.parse(att.data);
    const value = parsed?.[field] ?? parsed?.data?.[field];
    return value !== undefined ? String(value) : "verified";
  } catch {
    return "verified";
  }
}

function extractSignatureFragment(attestation: unknown): string {
  try {
    const att = attestation as { signatures?: string[] };
    const sig = att.signatures?.[0] ?? "";
    return sig ? `0x${sig.replace(/^0x/, "").slice(0, 12)}…` : "0xUNVERIFIED";
  } catch {
    return "0xUNVERIFIED";
  }
}

/**
 * Demo-mode attestation: used when a template has no live Primus template
 * ID yet, or the extension isn't installed. Produces a clearly-labeled
 * mock badge so the flow can be explored end to end.
 */
export async function runDemoAttestation({
  template,
  recipient,
}: RunAttestationOptions): Promise<ProofRecord> {
  await new Promise((r) => setTimeout(r, 1400));
  return {
    id: crypto.randomUUID(),
    templateId: template.id,
    templateName: template.name,
    issuer: template.issuer,
    headline: template.headline,
    seal: template.seal,
    accent: template.accent,
    value: demoValueFor(template),
    recipient: recipient || "demo.eth",
    attestation: null,
    attestationHash: `0xDEMO${Math.random().toString(16).slice(2, 10)}…`,
    issuedAt: new Date().toISOString(),
    mode: "demo",
  };
}

function demoValueFor(template: BadgeTemplate): string {
  switch (template.id) {
    case "x-followers":
      return "12.4K followers";
    case "x-account-age":
      return "since 2018";
    case "github-contributions":
      return "1,284 contributions";
    case "spotify-minutes":
      return "38,210 minutes";
    case "binance-kyc":
      return "KYC Level 2";
    case "okx-kyc":
      return "KYC Level 2";
    case "luma-events":
      return "17 events attended";
    case "tiktok-followers":
      return "8.9K followers";
    default:
      return "verified";
  }
}
