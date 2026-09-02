interface Props {
  view: "mint" | "profile";
  onNavigate: (v: "mint" | "profile") => void;
  proofCount: number;
}

export default function Header({ view, onNavigate, proofCount }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brass text-brass font-mono text-xs">
            ✓
          </span>
          <span className="font-display text-lg tracking-tight text-inktext">
            The Ledger
          </span>
          <span className="ml-1 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:inline">
            by Primus
          </span>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-panel p-1">
          <button
            onClick={() => onNavigate("mint")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === "mint" ? "bg-brass text-ink" : "text-muted hover:text-inktext"
            }`}
          >
            Mint a proof
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === "profile" ? "bg-brass text-ink" : "text-muted hover:text-inktext"
            }`}
          >
            My profile{proofCount > 0 ? ` (${proofCount})` : ""}
          </button>
        </nav>
      </div>
    </header>
  );
}
