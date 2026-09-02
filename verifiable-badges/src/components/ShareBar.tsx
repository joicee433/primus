import { useState } from "react";
import type { ProofRecord } from "../lib/types";

interface Props {
  proof: ProofRecord;
}

export default function ShareBar({ proof }: Props) {
  const [copied, setCopied] = useState(false);

  // In production, point this at a route that renders a public, re-verifiable
  // view of the stored attestation (e.g. /proof/[id] backed by a datastore).
  const proofUrl = `${window.location.origin}/proof/${proof.id}`;

  const shareText = `Just notarized "${proof.headline}: ${proof.value}" with a zkTLS proof via @primuslabs — verifiable by anyone, no login shared.`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(proofUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(proofUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — no-op, link is still visible in the UI
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={xShareUrl}
        target="_blank"
        rel="noreferrer"
        className="flex-1 rounded-full border border-white/15 py-2 text-center text-xs font-semibold text-inktext transition hover:border-brass hover:text-brass"
      >
        Share on X
      </a>
      <button
        onClick={copyLink}
        className="flex-1 rounded-full border border-white/15 py-2 text-xs font-semibold text-inktext transition hover:border-brass hover:text-brass"
      >
        {copied ? "Link copied" : "Copy proof link"}
      </button>
    </div>
  );
}
