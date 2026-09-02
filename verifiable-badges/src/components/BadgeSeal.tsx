import type { ProofRecord } from "../lib/types";

const ACCENTS = {
  brass: { ring: "#C9A227", glow: "rgba(201,162,39,0.35)", text: "#4A3B10" },
  mint: { ring: "#4FD1AE", glow: "rgba(79,209,174,0.30)", text: "#0F3F34" },
  rust: { ring: "#B5563B", glow: "rgba(181,86,59,0.30)", text: "#4A2013" },
};

interface Props {
  proof: Pick<ProofRecord, "seal" | "accent" | "headline" | "issuer" | "value" | "attestationHash" | "issuedAt" | "mode">;
  size?: number;
}

export default function BadgeSeal({ proof, size = 220 }: Props) {
  const c = ACCENTS[proof.accent];
  const date = new Date(proof.issuedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${proof.headline} verified badge, value ${proof.value}`}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <radialGradient id={`bg-${proof.accent}`} cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#F7F2E3" />
            <stop offset="100%" stopColor="#EDE6D3" />
          </radialGradient>
          <filter id="seal-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor={c.glow} />
          </filter>
        </defs>

        {/* perforated outer ring */}
        <circle cx="100" cy="100" r="96" fill="none" stroke={c.ring} strokeWidth="1" strokeDasharray="1.6 4.2" opacity="0.8" />

        {/* main seal disc */}
        <circle cx="100" cy="100" r="88" fill={`url(#bg-${proof.accent})`} filter="url(#seal-shadow)" />
        <circle cx="100" cy="100" r="88" fill="none" stroke={c.ring} strokeWidth="2.5" />
        <circle cx="100" cy="100" r="80" fill="none" stroke={c.ring} strokeWidth="1" opacity="0.55" />

        {/* issuer glyph */}
        <text
          x="100"
          y="78"
          textAnchor="middle"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="20"
          fontWeight="600"
          fill={c.text}
          letterSpacing="1"
        >
          {proof.seal}
        </text>

        {/* headline */}
        <text
          x="100"
          y="102"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize="12.5"
          fontWeight="600"
          fill={c.text}
        >
          {proof.headline}
        </text>

        {/* verified value */}
        <text
          x="100"
          y="120"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="9.5"
          fontWeight="600"
          fill={c.text}
          opacity="0.85"
        >
          {proof.value.length > 22 ? proof.value.slice(0, 22) + "…" : proof.value}
        </text>

        {/* date + curved "verified" ribbon text */}
        <path id={`ring-${proof.accent}-${proof.headline}`} d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
        <text fontFamily="IBM Plex Mono, monospace" fontSize="7.5" fill={c.text} letterSpacing="2.5" opacity="0.75">
          <textPath href={`#ring-${proof.accent}-${proof.headline}`} startOffset="50%" textAnchor="middle">
            VERIFIED · {date.toUpperCase()}
          </textPath>
        </text>

        {/* issuer + hash footer */}
        <text x="100" y="150" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7" fill={c.text} opacity="0.6">
          via {proof.issuer}
        </text>
        <text x="100" y="160" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" fill={c.text} opacity="0.55">
          {proof.attestationHash}
        </text>

        {proof.mode === "demo" && (
          <text x="100" y="172" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="6" fill="#B5563B" letterSpacing="1.5">
            DEMO PROOF
          </text>
        )}
      </svg>
    </div>
  );
}
