"use client";

import { useSorteioStore } from "@/lib/sorteio-store";

export function MesaControls() {
  const flags = useSorteioStore((s) => s.flags);
  const setFlag = useSorteioStore((s) => s.setFlag);

  return (
    <details className="fixed bottom-3 right-3 z-40 max-w-[220px] rounded-lg border border-[#d4af37]/25 bg-[#06080f]/95 px-3 py-2 text-xs text-white/80 shadow-lg backdrop-blur-md">
      <summary className="cursor-pointer select-none font-semibold text-[#d4af37]/90">
        Controles
      </summary>
      <p className="mt-2 text-[10px] leading-snug text-white/45">
        Persistem no sessionStorage com a lista.
      </p>
      <ul className="mt-2 space-y-2">
        <li className="flex items-center justify-between gap-2">
          <span>Girar roleta</span>
          <input
            type="checkbox"
            checked={flags.allowSpinRoulette}
            onChange={(e) => setFlag("allowSpinRoulette", e.target.checked)}
            className="accent-[#d4af37]"
            aria-label="Permitir girar roleta"
          />
        </li>
        <li className="flex items-center justify-between gap-2">
          <span>Incluir participante</span>
          <input
            type="checkbox"
            checked={flags.allowAddParticipant}
            onChange={(e) => setFlag("allowAddParticipant", e.target.checked)}
            className="accent-[#d4af37]"
            aria-label="Permitir incluir participante"
          />
        </li>
        <li className="flex items-center justify-between gap-2">
          <span>Nova rinha</span>
          <input
            type="checkbox"
            checked={flags.allowNovaRodada}
            onChange={(e) => setFlag("allowNovaRodada", e.target.checked)}
            className="accent-[#d4af37]"
            aria-label="Permitir nova rinha"
          />
        </li>
      </ul>
    </details>
  );
}
