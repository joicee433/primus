import { useState } from "react";
import type { BadgeTemplate, ProofRecord } from "../lib/types";
import { isPlaceholderTemplate } from "../lib/templates";
import {
  runLiveAttestation,
  runDemoAttestation,
  primusConfigured,
  PrimusExtensionMissingError,
  PrimusNotConfiguredError,
} from "../lib/primus";
import BadgeSeal from "./BadgeSeal";

interface Props {
  template: BadgeTemplate;
  onClose: () => void;
  onMinted: (proof: ProofRecord) => void;
}

type Stage = "form" | "working" | "done" | "error";

export default function ProofModal({ template, onClose, onMinted }: Props) {
  const [recipient, setRecipient] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState<string | null>(null);
  const [minted, setMinted] = useState<ProofRecord | null>(null);

  const willUseDemo = isPlaceholderTemplate(template) || !primusConfigured();
  console.log("DEBUG:", { willUseDemo, templateId: template.primusTemplateId, configured: primusConfigured() });

  async function handleGenerate() {
    setStage("working");
    setError(null);
    try {
      const proof = willUseDemo
        ? await runDemoAttestation({ template, recipient })
        : await runLiveAttestation ({ template, recipient });
      setMinted(proof);
      setStage("done");
    } catch (err) {
      if (err instanceof PrimusExtensionMissingError) {
        setError(
          "Couldn't reach the Primus extension. Install it, then try again — or continue in demo mode."
        );
      } else if (err instanceof PrimusNotConfiguredError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong generating the proof.");
      }
      setStage("error");
    }
  }

  async function handleFallbackDemo() {
    setStage("working");
    try {
      const proof = await runDemoAttestation({ template, recipient });
      setMinted(proof);
      setStage("done");
    } catch {
      setStage("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brass">{template.issuer}</p>
            <h3 className="mt-1 font-display text-xl text-inktext">{template.headline}</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-inktext">
            ✕
          </button>
        </div>

        {stage === "form" && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted">{template.description}</p>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-inktext">
                Bind this proof to (wallet address or handle)
              </span>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... or @yourhandle"
                className="w-full rounded-lg border border-white/15 bg-ink px-3 py-2.5 text-sm text-inktext placeholder:text-muted/60 focus:border-brass focus:outline-none"
              />
            </label>

            {willUseDemo && (
              <p className="rounded-lg border border-brass/30 bg-brass/10 px-3 py-2 text-xs leading-relaxed text-brassLight">
                No live Primus template ID is wired up for this badge yet, so
                this will generate a clearly-labeled demo proof instead of a
                real attestation. See README.md to connect a real one.
              </p>
            )}

            <button
              onClick={handleGenerate}
              className="w-full rounded-full bg-brass py-3 text-sm font-semibold text-ink transition hover:bg-brassLight"
            >
              {willUseDemo ? "Generate demo proof" : "Open Primus extension"}
            </button>
          </div>
        )}

        {stage === "working" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-brass border-t-transparent" />
            <p className="text-center text-sm text-muted">
              {willUseDemo
                ? "Notarizing your demo proof…"
                : "Waiting on the Primus extension to capture and sign your data…"}
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="space-y-4">
            <p className="rounded-lg border border-rust/40 bg-rust/10 px-3 py-2.5 text-sm text-inktext">
              {error}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStage("form")}
                className="flex-1 rounded-full border border-white/15 py-2.5 text-sm font-medium text-inktext hover:border-brass"
              >
                Try again
              </button>
              <button
                onClick={handleFallbackDemo}
                className="flex-1 rounded-full bg-brass py-2.5 text-sm font-semibold text-ink hover:bg-brassLight"
              >
                Use demo mode
              </button>
            </div>
          </div>
        )}

        {stage === "done" && minted && (
          <div className="flex flex-col items-center gap-4 py-2">
            <BadgeSeal proof={minted} size={180} />
            <p className="text-center text-sm text-muted">
              Sealed and added to your profile.
            </p>
            <button
              onClick={() => {
                onMinted(minted);
                onClose();
              }}
              className="w-full rounded-full bg-brass py-3 text-sm font-semibold text-ink transition hover:bg-brassLight"
            >
              Add to my profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
