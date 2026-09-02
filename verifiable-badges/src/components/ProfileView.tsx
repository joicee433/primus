import type { ProofRecord } from "../lib/types";
import BadgeSeal from "./BadgeSeal";
import ShareBar from "./ShareBar";

interface Props {
  proofs: ProofRecord[];
  onRemove: (id: string) => void;
  onGoMint: () => void;
}

export default function ProfileView({ proofs, onRemove, onGoMint }: Props) {
  if (proofs.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-white/20 text-2xl text-muted">
          ○
        </div>
        <h2 className="font-display text-2xl text-inktext">Your ledger is empty</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Proofs you mint will be sealed here, ready to share or add to your
          on-chain profile.
        </p>
        <button
          onClick={onGoMint}
          className="mt-6 rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-ink hover:bg-brassLight"
        >
          Mint your first proof
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">Your ledger</p>
        <h2 className="mt-2 font-display text-3xl text-inktext">Verifiable Profile</h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          {proofs.length} seal{proofs.length === 1 ? "" : "s"} collected. Each
          one is independently re-verifiable from its attestation — no one
          has to take your word for it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {proofs.map((proof) => (
          <div
            key={proof.id}
            className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-panel p-6"
          >
            <BadgeSeal proof={proof} size={170} />
            <div className="w-full">
              <ShareBar proof={proof} />
              <button
                onClick={() => onRemove(proof.id)}
                className="mt-2 w-full text-center text-xs text-muted hover:text-rust"
              >
                Remove from profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
