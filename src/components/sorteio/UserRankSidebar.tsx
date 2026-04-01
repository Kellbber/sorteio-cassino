"use client";

import { useEffect, useMemo, useState } from "react";
import { formatParticipantSearchLabel } from "@/lib/participant-identity";
import type { User } from "@/lib/types";

/** ~8 linhas (ranking com 3 linhas de texto por item). */
const LIST_MAX_HEIGHT =
  "min(31rem,calc(100dvh-15rem))" as const;

const formatBrl = (n: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

type UserRankSidebarProps = {
  users: User[];
  onUpdateUserValue: (id: string, value: number) => void;
  /** Ao sortear, preenche a pesquisa com o ganhador para editar o valor. */
  searchPreset?: { userId: string; nonce: number } | null;
  /** Chamado após salvar valor para limpar preset e não reabrir a pesquisa. */
  onClearSearchPreset?: () => void;
  className?: string;
};

export function UserRankSidebar({
  users,
  onUpdateUserValue,
  searchPreset = null,
  onClearSearchPreset,
  className,
}: UserRankSidebarProps) {
  const [query, setQuery] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (!searchPreset) return;
    const u = users.find((x) => x.id === searchPreset.userId);
    if (!u) return;
    setQuery(formatParticipantSearchLabel(u));
    /* Só ao novo sorteio (nonce) — não incluir `users` para não sobrescrever a busca ao editar valores. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchPreset]);

  useEffect(() => {
    if (!searchPreset || !onClearSearchPreset) return;
    if (!users.some((x) => x.id === searchPreset.userId)) {
      onClearSearchPreset();
    }
  }, [searchPreset, users, onClearSearchPreset]);

  const ranked = useMemo(
    () => [...users].sort((a, b) => b.value - a.value),
    [users],
  );

  const totalPremios = useMemo(
    () => users.reduce((sum, u) => sum + u.value, 0),
    [users],
  );

  const qTrim = query.trim();
  const qLower = qTrim.toLowerCase();

  const presetUser =
    searchPreset !== null
      ? users.find((x) => x.id === searchPreset.userId)
      : undefined;

  const matches = useMemo(() => {
    if (!qTrim) return [];
    return ranked.filter((u) => {
      const label = formatParticipantSearchLabel(u);
      if (label.toLowerCase() === qLower) return true;
      return (
        u.name.toLowerCase().includes(qLower) ||
        u.gameName.toLowerCase().includes(qLower)
      );
    });
  }, [ranked, qTrim, qLower]);

  const selected = useMemo((): User | undefined => {
    if (presetUser && searchPreset) return presetUser;
    if (!qTrim) return undefined;
    const exact = ranked.find(
      (u) => formatParticipantSearchLabel(u) === qTrim,
    );
    if (exact) return exact;
    if (matches.length === 1) return matches[0];
    return undefined;
  }, [presetUser, searchPreset, qTrim, matches, ranked]);

  const selectedId = selected?.id ?? null;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (!searchPreset || !onClearSearchPreset) return;
    const u = users.find((x) => x.id === searchPreset.userId);
    if (!u) {
      onClearSearchPreset();
      return;
    }
    if (formatParticipantSearchLabel(u) !== value.trim()) {
      onClearSearchPreset();
    }
  };

  useEffect(() => {
    if (!selectedId) {
      setEditValue("");
      return;
    }
    const u = users.find((x) => x.id === selectedId);
    if (!u) return;
    setEditValue(
      u.value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  }, [selectedId, users]);

  const handleSave = () => {
    if (!selected) return;
    const normalized = editValue.trim().replace(/\./g, "").replace(",", ".");
    const num = parseFloat(normalized);
    if (!Number.isFinite(num) || num < 0) return;
    onUpdateUserValue(selected.id, Math.round(num * 100) / 100);
    setQuery("");
    setEditValue("");
    onClearSearchPreset?.();
  };

  return (
    <aside
      className={`flex h-full min-h-0 w-full flex-col border-b border-[#d4af37]/20 bg-[#06080f]/90 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md lg:max-w-[300px] lg:border-b-0 lg:border-l lg:shadow-[-12px_0_40px_rgba(0,0,0,0.35)] ${className ?? ""}`}
    >
      <div className="border-b border-[#d4af37]/15 px-5 py-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-wide text-[#f5e6c8]">
          Ranking
        </h2>
        <p className="mt-1 text-xs text-white/45">
          Maior valor primeiro — use “Nome · Jogo” para distinguir quem tem nome
          parecido.
        </p>
      </div>

      <div className="border-b border-[#d4af37]/20 bg-gradient-to-b from-[#d4af37]/12 to-transparent px-5 py-4">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d4af37]/90">
          Prêmio do ganhador
        </p>
        <p className="mt-2 text-center font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums tracking-tight text-[#e8c547] drop-shadow-[0_0_24px_rgba(212,175,55,0.35)] sm:text-3xl">
          {formatBrl(totalPremios)}
        </p>
      </div>

      <div className="border-b border-[#d4af37]/15 bg-[#04060c]/80 px-4 py-4">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#d4af37]/80">
          Pesquisar usuário
        </label>
        <input
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Nome, jogo ou Nome · Jogo…"
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/40"
        />

        {qTrim && matches.length > 1 && (
          <ul className="custom-scrollbar mt-2 max-h-28 overflow-y-auto rounded-lg border border-white/10 bg-black/50">
            {matches.slice(0, 8).map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => setQuery(formatParticipantSearchLabel(u))}
                  className="w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
                >
                  {u.name}{" "}
                  <span className="text-white/40">· {u.gameName}</span>{" "}
                  <span className="text-[#d4af37]/80">{formatBrl(u.value)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {selected && qTrim && (
          <div className="mt-3 space-y-2">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40">
              Novo valor (R$) — {selected.name}{" "}
              <span className="text-white/35">· {selected.gameName}</span>
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full rounded-lg border border-[#d4af37]/30 bg-black/50 px-3 py-2 text-sm tabular-nums text-[#f5e6c8] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50"
            />
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-lg bg-gradient-to-r from-[#1a4d3a] to-[#0d3b2e] py-2 text-xs font-semibold uppercase tracking-wider text-[#b8e6d5] ring-1 ring-[#2d6b4f]/60 transition hover:brightness-110"
            >
              Salvar valor
            </button>
          </div>
        )}

        {qTrim && matches.length === 0 && (
          <p className="mt-2 text-xs text-[#c41e3a]/90">Nenhum usuário encontrado.</p>
        )}
      </div>

      <ol
        className="panel-list-scroll flex min-h-0 flex-1 list-none flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-3"
        style={{ maxHeight: LIST_MAX_HEIGHT }}
      >
        {ranked.length === 0 ? (
          <li className="rounded-lg border border-dashed border-white/15 px-4 py-10 text-center text-sm text-white/40">
            Ninguém no ranking ainda. Adicione participantes à esquerda.
          </li>
        ) : (
          ranked.map((u, index) => (
            <li
              key={u.id}
              className="flex items-center gap-3 rounded-lg border border-white/5 bg-gradient-to-r from-white/[0.04] to-transparent px-3 py-2.5"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  index === 0
                    ? "bg-gradient-to-br from-[#d4af37] to-[#8b6914] text-[#1a1206]"
                    : index === 1
                      ? "bg-white/15 text-white/90"
                      : index === 2
                        ? "bg-[#8b4513]/40 text-[#deb887]"
                        : "bg-white/5 text-white/50"
                }`}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/92">
                  {u.name}
                </p>
                <p className="truncate text-[11px] text-white/45">{u.gameName}</p>
                <p className="text-xs font-semibold tabular-nums text-[#d4af37]/95">
                  {formatBrl(u.value)}
                </p>
              </div>
            </li>
          ))
        )}
      </ol>
    </aside>
  );
}
