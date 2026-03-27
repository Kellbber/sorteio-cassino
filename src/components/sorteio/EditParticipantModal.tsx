"use client";

import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

type EditParticipantModalProps = {
  user: User | null;
  error?: string;
  onDismissError?: () => void;
  onCancel: () => void;
  onConfirm: (name: string, gameName: string) => void;
};

export function EditParticipantModal({
  user,
  error,
  onDismissError,
  onCancel,
  onConfirm,
}: EditParticipantModalProps) {
  const [name, setName] = useState("");
  const [gameName, setGameName] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setGameName(user.gameName);
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const g = gameName.trim();
    if (!n || !g) return;
    onConfirm(n, g);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-participant-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Cancelar"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#d4af37]/50 bg-gradient-to-b from-[#14121a] to-[#080a10] p-6 shadow-[0_0_48px_rgba(212,175,55,0.2)]"
      >
        <h2
          id="edit-participant-title"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#f5e6c8]"
        >
          Editar participante
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="edit-participant-name"
              className="block text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]/80"
            >
              Nome
            </label>
            <input
              id="edit-participant-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                onDismissError?.();
              }}
              placeholder="Nome do participante"
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/40"
            />
          </div>
          <div>
            <label
              htmlFor="edit-participant-game"
              className="block text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]/80"
            >
              Jogo
            </label>
            <input
              id="edit-participant-game"
              type="text"
              value={gameName}
              onChange={(e) => {
                setGameName(e.target.value);
                onDismissError?.();
              }}
              placeholder="Nome do jogo"
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/40"
            />
          </div>
        </div>
        {error ? (
          <p className="mt-3 text-xs text-[#c41e3a]/90">{error}</p>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#1a3a5f] to-[#0d2847] px-5 py-2.5 text-sm font-semibold text-[#b8d4f0] ring-1 ring-[#2a5580]/50 transition hover:brightness-110"
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}
