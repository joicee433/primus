export type TemplateCategory = "social" | "dev" | "exchange" | "music" | "events";

export interface BadgeTemplate {
  id: string;
  // Primus Developer Hub Template ID. Replace placeholders with real IDs
  // once you've created templates at https://dev.primuslabs.xyz
  primusTemplateId: string;
  name: string;
  issuer: string;
  category: TemplateCategory;
  headline: string; // e.g. "X Followers"
  description: string;
  seal: string; // short glyph/emoji-free label used on the badge, e.g. "𝕏"
  accent: "brass" | "mint" | "rust";
  // Which field from the attestation's response body to feature on the badge
  displayField: string;
}

export interface ProofRecord {
  id: string; // local id
  templateId: string;
  templateName: string;
  issuer: string;
  headline: string;
  seal: string;
  accent: "brass" | "mint" | "rust";
  value: string; // the verified value shown on the badge (e.g. "12.4K followers")
  recipient: string; // wallet address or handle the proof is bound to
  attestation: unknown; // raw attestation object from the SDK, kept for re-verification
  attestationHash: string; // short hash/signature fragment shown as the "seal number"
  issuedAt: string; // ISO timestamp
  mode: "live" | "demo";
}
