"use client";

type ConfirmResetModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmResetModal({
  open,
  onCancel,
  onConfirm,
}: ConfirmResetModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Cancelar"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#d4af37]/50 bg-gradient-to-b from-[#14121a] to-[#080a10] p-6 shadow-[0_0_48px_rgba(212,175,55,0.2)]">
        <h2
          id="reset-title"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#f5e6c8]"
        >
          Nova rinha
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          Isso vai <strong className="text-[#f5e6c8]">limpar tudo</strong>: todos os
          participantes, o ranking e os valores. Esta ação não pode ser desfeita.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-gradient-to-r from-[#7f1d1d] to-[#c41e3a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(196,30,58,0.35)] transition hover:brightness-110"
          >
            Limpar tudo
          </button>
        </div>
      </div>
    </div>
  );
}
