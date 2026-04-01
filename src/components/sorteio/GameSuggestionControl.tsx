"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameSuggestionModal } from "@/components/sorteio/GameSuggestionModal";
import { pickRandomGameSuggestion } from "@/lib/game-suggestion-jokes";

export function GameSuggestionControl() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const request = useCallback(() => {
    if (loading || open) return;
    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setLoading(false);
      setPhrase(pickRandomGameSuggestion());
      setOpen(true);
    }, 2000);
  }, [loading, open]);

  return (
    <>
      <button
        type="button"
        onClick={request}
        disabled={loading}
        aria-busy={loading}
        className="max-w-[10.5rem] rounded-xl border border-[#d4af37]/55 bg-[#0a0e18]/95 px-2.5 py-2 text-left text-[9px] font-bold uppercase leading-tight tracking-wide text-[#e8d5a3] shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-sm transition enabled:hover:border-[#d4af37] enabled:hover:bg-[#121a2a] enabled:active:scale-[0.98] disabled:cursor-wait sm:max-w-[12.5rem] sm:px-3 sm:py-2.5 sm:text-[10px]"
      >
        {loading ? (
          <span className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-[#d4af37]/30 border-t-[#d4af37] sm:h-3.5 sm:w-3.5"
              aria-hidden
            />
            <span>Pensando…</span>
          </span>
        ) : (
          <span>Pedir sugestão de jogo</span>
        )}
      </button>

      <GameSuggestionModal
        open={open}
        phrase={phrase}
        onClose={() => {
          setOpen(false);
          setPhrase("");
        }}
      />
    </>
  );
}
