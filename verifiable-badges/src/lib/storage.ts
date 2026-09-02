import type { ProofRecord } from "./types";

const KEY = "verifiable-profile.proofs.v1";

export function loadProofs(): ProofRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProofRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveProof(proof: ProofRecord): ProofRecord[] {
  const existing = loadProofs();
  const next = [proof, ...existing.filter((p) => p.id !== proof.id)];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function removeProof(id: string): ProofRecord[] {
  const next = loadProofs().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
