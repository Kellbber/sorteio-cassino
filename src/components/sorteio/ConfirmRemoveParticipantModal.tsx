"use client";

type ConfirmRemoveParticipantModalProps = {
  open: boolean;
  participantName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmRemoveParticipantModal({
  open,
  participantName,
  onCancel,
  onConfirm,
}: ConfirmRemoveParticipantModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="remove-participant-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Cancelar"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#d4af37]/50 bg-gradient-to-b from-[#14121a] to-[#080a10] p-6 shadow-[0_0_48px_rgba(212,175,55,0.2)]">
        <h2
          id="remove-participant-title"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#f5e6c8]"
        >
          Remover participante
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          Remover <strong className="text-[#f5e6c8]">{participantName}</strong> do
          sorteio e do ranking? O valor acumulado desta pessoa será apagado. Esta
          ação não pode ser desfeita.
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
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
