"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { buildRouletteConicGradient } from "@/lib/roulette-segment-colors";
import type { User } from "@/lib/types";

type RouletteWheelProps = {
  participants: User[];
  disabled?: boolean;
  onWinner: (user: User) => void;
};

function truncateForWheel(name: string, max = 14) {
  const t = name.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function RouletteWheel({
  participants,
  disabled,
  onWinner,
}: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [durationMs, setDurationMs] = useState(5200);
  const winnerIndexRef = useRef(0);
  const participantsAtSpinRef = useRef<User[]>([]);
  const settledRef = useRef(false);

  const n = participants.length;
  const gradient = useMemo(() => buildRouletteConicGradient(n), [n]);

  const spin = useCallback(() => {
    if (n < 1 || isSpinning || disabled) return;

    settledRef.current = false;
    setIsSpinning(true);
    participantsAtSpinRef.current = participants;
    const w = Math.floor(Math.random() * n);
    winnerIndexRef.current = w;
    const segment = 360 / n;
    const jitter = (Math.random() - 0.5) * Math.min(segment * 0.35, 28);
    const spins = 6 + Math.floor(Math.random() * 4);
    const centerAngle = (w + 0.5) * segment + jitter;
    const nextDur = 4800 + Math.floor(Math.random() * 1400);
    setDurationMs(nextDur);
    setRotation((r) => {
      const offsetNeeded = (((-centerAngle - r) % 360) + 360) % 360;
      return r + spins * 360 + offsetNeeded;
    });
  }, [n, isSpinning, disabled, participants]);

  const handleTransitionEnd = useCallback(() => {
    if (!isSpinning || settledRef.current) return;
    settledRef.current = true;
    setIsSpinning(false);
    const list = participantsAtSpinRef.current;
    const u = list[winnerIndexRef.current];
    if (u) onWinner(u);
  }, [isSpinning, onWinner]);

  const canSpin = n >= 1 && !isSpinning && !disabled;
  const segmentDeg = n > 0 ? 360 / n : 0;

  return (
    <div className="flex flex-col items-center justify-start gap-10 py-8">
      <div className="relative w-fit">
        <div
          className="pointer-events-none absolute -top-1 left-1/2 z-20 -translate-x-1/2"
          aria-hidden
        >
          <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-[#f5e6c8] drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" />
        </div>

        <div
          className="rounded-full p-[10px] shadow-[0_0_0_4px_rgba(212,175,55,0.35),0_0_60px_rgba(196,30,58,0.25),inset_0_0_40px_rgba(0,0,0,0.5)]"
          style={{
            background:
              "linear-gradient(145deg, #d4af37 0%, #6b5a1e 40%, #2a2410 100%)",
          }}
        >
          <div
            className="relative h-[min(72vw,320px)] w-[min(72vw,320px)] overflow-hidden rounded-full sm:h-[340px] sm:w-[340px]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? `transform ${durationMs}ms cubic-bezier(0.12, 0.72, 0.12, 1)`
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: gradient }}
              aria-hidden
            />

            {n > 0 && (
              <div
                className="pointer-events-none absolute inset-0 z-[5]"
                aria-hidden
              >
                {participants.map((u, i) => {
                  const midDeg = (i + 0.5) * segmentDeg;
                  return (
                    <div
                      key={u.id}
                      className="absolute left-1/2 top-1/2 h-0 w-0"
                      style={{
                        transform: `rotate(${midDeg}deg) translateY(calc(-1 * min(31vw, 118px)))`,
                      }}
                    >
                      <span
                        className="absolute left-1/2 top-1/2 max-h-[min(22vw,88px)] select-none overflow-hidden text-ellipsis font-[family-name:var(--font-display)] text-[10px] font-bold uppercase leading-tight tracking-wide text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_0_8px_rgba(0,0,0,0.75)] sm:text-[11px]"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "translate(-50%, -50%) rotate(180deg)",
                        }}
                        title={u.name}
                      >
                        {truncateForWheel(u.name)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              className="absolute left-1/2 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4af37]/30 bg-gradient-to-b from-[#121a2a] to-[#07090f] shadow-[inset_0_0_10px_rgba(0,0,0,0.9)]"
              aria-hidden
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]"
          aria-hidden
        />
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={!canSpin}
        className="group relative min-w-[220px] overflow-hidden rounded-2xl px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1a0f0f] shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition enabled:hover:scale-[1.02] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          background:
            "linear-gradient(180deg, #f0d78c 0%, #d4af37 45%, #8b6914 100%)",
        }}
      >
        <span className="relative z-10">
          {isSpinning ? "Girando…" : "Girar roleta"}
        </span>
        <span className="absolute inset-0 bg-white/25 opacity-0 transition group-enabled:group-hover:opacity-100" />
      </button>
    </div>
  );
}
