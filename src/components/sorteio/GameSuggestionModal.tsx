"use client";

type GameSuggestionModalProps = {
  open: boolean;
  phrase: string;
  onClose: () => void;
};

export function GameSuggestionModal({
  open,
  phrase,
  onClose,
}: GameSuggestionModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-suggestion-title"
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
          Sugestão de jogo
        </p>
        <h2
          id="game-suggestion-title"
          className="sr-only"
        >
          Sugestão sorteada
        </h2>
        <p className="relative mt-5 text-center text-base leading-relaxed text-[#f5e6c8] sm:text-lg">
          {phrase}
        </p>
        <p className="relative mt-4 text-center text-xs text-white/45">
          Só zoeira — sem garantias.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="relative mt-8 w-full rounded-xl bg-gradient-to-r from-[#8b1538] via-[#c41e3a] to-[#8b1538] py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_4px_24px_rgba(196,30,58,0.45)] transition hover:brightness-110 active:scale-[0.98]"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
