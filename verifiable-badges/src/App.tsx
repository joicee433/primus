import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TemplateGrid from "./components/TemplateGrid";
import ProofModal from "./components/ProofModal";
import ProfileView from "./components/ProfileView";
import type { BadgeTemplate, ProofRecord } from "./lib/types";
import { loadProofs, saveProof, removeProof } from "./lib/storage";

export default function App() {
  const [view, setView] = useState<"mint" | "profile">("mint");
  const [activeTemplate, setActiveTemplate] = useState<BadgeTemplate | null>(null);
  const [proofs, setProofs] = useState<ProofRecord[]>([]);

  useEffect(() => {
    setProofs(loadProofs());
  }, []);

  function handleMinted(proof: ProofRecord) {
    setProofs(saveProof(proof));
  }

  function handleRemove(id: string) {
    setProofs(removeProof(id));
  }

  return (
    <div className="min-h-screen">
      <Header view={view} onNavigate={setView} proofCount={proofs.length} />

      {view === "mint" ? (
        <>
          <Hero />
          <TemplateGrid onSelect={setActiveTemplate} />
        </>
      ) : (
        <ProfileView proofs={proofs} onRemove={handleRemove} onGoMint={() => setView("mint")} />
      )}

      <footer className="border-t border-white/10 py-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
        Verified with Primus zkTLS · your data never touches our servers
      </footer>

      {activeTemplate && (
        <ProofModal
          template={activeTemplate}
          onClose={() => setActiveTemplate(null)}
          onMinted={handleMinted}
        />
      )}
    </div>
  );
}
