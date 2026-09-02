export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-14 pt-16">
      <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brass">
            Proof of you, notarized
          </p>
          <h1 className="font-display text-[2.75rem] leading-[1.05] text-inktext sm:text-6xl">
            Turn what's true about you online
            <span className="text-brass"> into a proof</span> no one has to trust.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Pick a data source, run it through Primus's zkTLS — a cryptographic
            notary for the open web — and walk away with a badge that's
            verifiable by anyone, without ever showing them your login.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#templates"
              className="rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink transition hover:bg-brassLight"
            >
              Choose what to prove
            </a>
            <a
              href="https://chromewebstore.google.com/detail/primus-extension"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-inktext transition hover:border-brass hover:text-brass"
            >
              Install the Primus extension
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-brass/10 blur-2xl" />
          <svg viewBox="0 0 200 200" className="relative h-full w-full drop-shadow-[0_10px_30px_rgba(201,162,39,0.25)]">
            <circle cx="100" cy="100" r="96" fill="none" stroke="#C9A227" strokeWidth="1" strokeDasharray="1.6 4.2" opacity="0.7" />
            <circle cx="100" cy="100" r="88" fill="#EDE6D3" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A227" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#C9A227" strokeWidth="1" opacity="0.5" />
            <text x="100" y="95" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="600" fontSize="15" fill="#4A3B10">
              VERIFIABLE
            </text>
            <text x="100" y="115" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="600" fontSize="15" fill="#4A3B10">
              PROFILE
            </text>
            <path id="hero-ring" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
            <text fontFamily="IBM Plex Mono, monospace" fontSize="7.5" fill="#4A3B10" letterSpacing="3" opacity="0.7">
              <textPath href="#hero-ring" startOffset="50%" textAnchor="middle">
                ZKTLS · NO TRUST NEEDED
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
