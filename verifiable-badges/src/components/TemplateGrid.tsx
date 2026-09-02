import { TEMPLATES, isPlaceholderTemplate } from "../lib/templates";
import type { BadgeTemplate } from "../lib/types";

const ACCENT_DOT: Record<BadgeTemplate["accent"], string> = {
  brass: "bg-brass",
  mint: "bg-mint",
  rust: "bg-rust",
};

interface Props {
  onSelect: (template: BadgeTemplate) => void;
}

export default function TemplateGrid({ onSelect }: Props) {
  return (
    <section id="templates" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">Step one</p>
          <h2 className="mt-2 font-display text-3xl text-inktext">Choose what to prove</h2>
        </div>
        <p className="hidden max-w-xs text-sm text-muted sm:block">
          Every template runs through a Primus attestor — the data never
          passes through our servers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-brass/60 hover:bg-panel2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 font-mono text-xs text-inktext">
                {t.seal}
              </div>
              <span className={`h-2 w-2 rounded-full ${ACCENT_DOT[t.accent]}`} />
            </div>
            <h3 className="mt-4 font-display text-lg text-inktext">{t.headline}</h3>
            <p className="mt-1.5 text-sm leading-snug text-muted">{t.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="font-mono uppercase tracking-wider text-muted">{t.issuer}</span>
              {isPlaceholderTemplate(t) && (
                <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted">
                  demo mode
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
