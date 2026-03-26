"use client";

import type { User } from "@/lib/types";

type WinnerModalProps = {
  winner: User | null;
  onClose: () => void;
};

export function WinnerModal({ winner, onClose }: WinnerModalProps) {
  if (!winner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-2 border-[#d4af37]/80 bg-gradient-to-b from-[#1a0a0a] via-[#0f1729] to-[#050810] p-8 shadow-[0_0_60px_rgba(212,175,55,0.35)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#d4af37]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#c41e3a]/20 blur-3xl" />

        <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-[#d4af37]/90">
          Sorteado
        </p>
        <h2
          id="winner-title"
          className="mt-3 text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#f5e6c8] sm:text-4xl"
        >
          {winner.name}
        </h2>
        {winner.gameName ? (
          <p className="mt-2 text-center text-sm font-medium text-[#d4af37]/90">
            Jogo: {winner.gameName}
          </p>
        ) : null}
        <p className="mt-2 text-center text-sm text-white/55">
          Sairá da lista de participantes desta rodada. O cadastro permanece à
          direita no ranking.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#8b1538] via-[#c41e3a] to-[#8b1538] py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_4px_24px_rgba(196,30,58,0.45)] transition hover:brightness-110 active:scale-[0.98]"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
