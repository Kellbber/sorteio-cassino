"use client";

import type { User } from "@/lib/types";

const formatBrl = (n: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

type RoundChampionModalProps = {
  open: boolean;
  champion: User | null;
  onClose: () => void;
};

export function RoundChampionModal({
  open,
  champion,
  onClose,
}: RoundChampionModalProps) {
  if (!open || !champion) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="round-champion-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-2 border-[#d4af37]/80 bg-gradient-to-b from-[#1a1206] via-[#0f1729] to-[#050810] p-8 shadow-[0_0_60px_rgba(212,175,55,0.4)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#c9a227]/15 blur-3xl" />

        <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-[#d4af37]/90">
          Lista do sorteio esgotada
        </p>
        <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-widest text-white/45">
          Ganhador da rodada
        </p>
        <h2
          id="round-champion-title"
          className="mt-4 text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#f5e6c8] sm:text-4xl"
        >
          {champion.name}
        </h2>
        {champion.gameName ? (
          <p className="mt-2 text-center text-sm font-medium text-[#d4af37]/90">
            Jogo: {champion.gameName}
          </p>
        ) : null}

        <div className="mt-8 rounded-xl border border-[#d4af37]/35 bg-[#d4af37]/10 px-5 py-5">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d4af37]/85">
            Total do prêmio do ganhador
          </p>
          <p className="mt-2 text-center font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums tracking-tight text-[#e8c547] drop-shadow-[0_0_20px_rgba(212,175,55,0.35)] sm:text-4xl">
            {formatBrl(champion.value)}
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-white/50">
          Quem ficou em 1º no ranking por valor acumulado nesta rinha.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#6b5310] via-[#d4af37] to-[#6b5310] py-3.5 text-sm font-semibold uppercase tracking-wider text-[#1a1206] shadow-[0_4px_24px_rgba(212,175,55,0.35)] transition hover:brightness-110 active:scale-[0.98]"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
