"use client";

import { useState } from "react";
import { ConfirmRemoveParticipantModal } from "@/components/sorteio/ConfirmRemoveParticipantModal";
import { EditParticipantModal } from "@/components/sorteio/EditParticipantModal";
import { getRouletteSegmentColor } from "@/lib/roulette-segment-colors";
import type { User } from "@/lib/types";

/** ~8 linhas (nome + jogo por item). */
const LIST_MAX_HEIGHT =
  "min(26.5rem,calc(100dvh-15rem))" as const;

type ParticipantsPanelProps = {
  participants: User[];
  onAddParticipant: (name: string, gameName: string) => boolean;
  onUpdateParticipant: (userId: string, name: string, gameName: string) => boolean;
  onRemoveFromSorteio: (userId: string) => void;
  onRequestNewRound: () => void;
  /** Controlado pelo store (flags.allowAddParticipant). */
  addParticipantDisabled?: boolean;
  /** Controlado pelo store (flags + há usuários). */
  novaRodadaDisabled?: boolean;
  className?: string;
};

export function ParticipantsPanel({
  participants,
  onAddParticipant,
  onUpdateParticipant,
  onRemoveFromSorteio,
  onRequestNewRound,
  addParticipantDisabled = false,
  novaRodadaDisabled = false,
  className,
}: ParticipantsPanelProps) {
  const [name, setName] = useState("");
  const [gameName, setGameName] = useState("");
  const [addError, setAddError] = useState("");
  const [editModalError, setEditModalError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [removingUser, setRemovingUser] = useState<User | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (addParticipantDisabled) return;
    const n = name.trim();
    const g = gameName.trim();
    if (!n || !g) {
      setAddError("Preencha o nome e o nome do jogo.");
      return;
    }
    const ok = onAddParticipant(n, g);
    if (!ok) {
      setAddError("Já existe participante com este nome e jogo.");
      return;
    }
    setAddError("");
    setName("");
    setGameName("");
  };

  return (
    <aside
      className={`flex h-full min-h-0 w-full flex-col border-[#d4af37]/20 bg-[#06080f]/90 shadow-[0_-8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md lg:max-w-[300px] lg:border-r lg:shadow-[12px_0_40px_rgba(0,0,0,0.35)] ${className ?? ""}`}
    >
      <div className="border-b border-[#d4af37]/15 px-5 py-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-wide text-[#f5e6c8]">
          No sorteio
        </h2>
        <p className="mt-1 text-xs text-white/45">
          Quem você adicionar aqui entra na roleta e no ranking (valor R$ 0,00).
        </p>
      </div>

      <div className="border-b border-[#d4af37]/15 bg-[#04060c]/90 p-4">
        <form onSubmit={handleAdd} className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]/80">
            Adicionar participante
          </p>
          {addParticipantDisabled ? (
            <p className="text-xs text-white/40">
              Inclusão de participantes desativada (store / administrador).
            </p>
          ) : null}
          <input
            type="text"
            value={name}
            disabled={addParticipantDisabled}
            onChange={(e) => {
              setName(e.target.value);
              setAddError("");
            }}
            placeholder="Nome"
            autoComplete="off"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/40 disabled:cursor-not-allowed disabled:opacity-40"
          />
          <input
            type="text"
            value={gameName}
            disabled={addParticipantDisabled}
            onChange={(e) => {
              setGameName(e.target.value);
              setAddError("");
            }}
            placeholder="Nome do jogo"
            autoComplete="off"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/40 disabled:cursor-not-allowed disabled:opacity-40"
          />
          {addError ? (
            <p className="text-xs text-[#c41e3a]/90">{addError}</p>
          ) : null}
          <button
            type="submit"
            disabled={addParticipantDisabled}
            title={
              addParticipantDisabled
                ? "Inclusão desativada no store (allowAddParticipant)"
                : undefined
            }
            className="w-full rounded-lg bg-gradient-to-r from-[#1a3a5f] to-[#0d2847] py-2.5 text-xs font-semibold uppercase tracking-wider text-[#b8d4f0] ring-1 ring-[#2a5580]/50 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Incluir participante
          </button>
        </form>

        <button
          type="button"
          disabled={novaRodadaDisabled}
          onClick={onRequestNewRound}
          title={
            novaRodadaDisabled
              ? "Sem jogadores na mesa ou nova rinha desativada no store"
              : undefined
          }
          className="mt-4 w-full rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/10 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#e8d5a3] transition hover:bg-[#d4af37]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Nova rinha
        </button>
      </div>

      <ul
        className="panel-list-scroll flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-4"
        style={{ maxHeight: LIST_MAX_HEIGHT }}
      >
        {participants.length === 0 ? (
          <li className="rounded-lg border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/40">
            Lista vazia. Adicione participantes no formulário acima.
          </li>
        ) : (
          participants.map((u, i) => (
            <li
              key={u.id}
              className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-2 py-2.5 transition hover:border-[#d4af37]/25 hover:bg-white/[0.06]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#d4af37]/15 text-xs font-bold text-[#d4af37]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/90">
                  {u.name}
                </p>
                <p className="truncate text-xs text-[#d4af37]/75">{u.gameName}</p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalError("");
                    setEditingUser(u);
                  }}
                  className="rounded-md p-1.5 text-[#d4af37]/80 transition hover:bg-white/10 hover:text-[#f5e6c8]"
                  title="Editar nome e jogo"
                  aria-label={`Editar ${u.name}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setRemovingUser(u)}
                  className="rounded-md p-1.5 text-white/45 transition hover:bg-[#c41e3a]/20 hover:text-[#c41e3a]"
                  title="Remover do sorteio e do ranking"
                  aria-label={`Remover ${u.name} do sorteio e do ranking`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </button>
              </div>
              <span
                className="h-6 w-6 shrink-0 rounded-md border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.45)] ring-1 ring-black/50"
                style={{ backgroundColor: getRouletteSegmentColor(i) }}
                title={`Cor na roleta (${i + 1}ª fatia)`}
                aria-label={`Cor na roleta para ${u.name}`}
              />
            </li>
          ))
        )}
      </ul>

      <EditParticipantModal
        user={editingUser}
        error={editModalError}
        onDismissError={() => setEditModalError("")}
        onCancel={() => {
          setEditingUser(null);
          setEditModalError("");
        }}
        onConfirm={(n, g) => {
          if (!editingUser) return;
          const ok = onUpdateParticipant(editingUser.id, n, g);
          if (!ok) {
            setEditModalError("Já existe outro participante com este nome e jogo.");
            return;
          }
          setEditModalError("");
          setEditingUser(null);
        }}
      />

      <ConfirmRemoveParticipantModal
        open={removingUser !== null}
        participantName={removingUser?.name ?? ""}
        onCancel={() => setRemovingUser(null)}
        onConfirm={() => {
          if (!removingUser) return;
          onRemoveFromSorteio(removingUser.id);
          setRemovingUser(null);
        }}
      />
    </aside>
  );
}
