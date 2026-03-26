"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@/lib/types";
import {
  rehydrateSorteioStore,
  selectCanAddParticipant,
  selectCanNovaRodada,
  selectCanSpinRoulette,
  selectParticipants,
  useSorteioStore,
} from "@/lib/sorteio-store";
import { ConfirmResetModal } from "./ConfirmResetModal";
import { MesaControls } from "./MesaControls";
import { ParticipantsPanel } from "./ParticipantsPanel";
import { RoundChampionModal } from "./RoundChampionModal";
import { RouletteWheel } from "./RouletteWheel";
import { UserRankSidebar } from "./UserRankSidebar";
import { WinnerModal } from "./WinnerModal";

function pickRankingChampion(list: User[]): User | null {
  if (list.length === 0) return null;
  return [...list].sort((a, b) => b.value - a.value)[0] ?? null;
}

export function SorteioClient() {
  const users = useSorteioStore((s) => s.users);
  const eligibleUserIds = useSorteioStore((s) => s.eligibleUserIds);
  const addParticipant = useSorteioStore((s) => s.addParticipant);
  const removeEligibleUser = useSorteioStore((s) => s.removeEligibleUser);
  const updateUserValue = useSorteioStore((s) => s.updateUserValue);
  const resetSession = useSorteioStore((s) => s.resetSession);

  const canSpinRoulette = useSorteioStore(selectCanSpinRoulette);
  const canAddParticipant = useSorteioStore(selectCanAddParticipant);
  const canNovaRodada = useSorteioStore(selectCanNovaRodada);

  const [modalWinner, setModalWinner] = useState<User | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [rankingSearchPreset, setRankingSearchPreset] = useState<{
    userId: string;
    nonce: number;
  } | null>(null);
  const [roundEndChampion, setRoundEndChampion] = useState<User | null>(null);
  const [roundEndModalOpen, setRoundEndModalOpen] = useState(false);
  const pendingRoundEndRef = useRef<User | null>(null);
  const prevEligibleSizeRef = useRef<number | null>(null);

  useEffect(() => {
    void rehydrateSorteioStore();
  }, []);

  const participants = useMemo(
    () => selectParticipants(users, eligibleUserIds),
    [users, eligibleUserIds],
  );

  const handleWinner = useCallback(
    (winner: User) => {
      removeEligibleUser(winner.id);
      setModalWinner(winner);
      setRankingSearchPreset((prev) => ({
        userId: winner.id,
        nonce: (prev?.nonce ?? 0) + 1,
      }));
    },
    [removeEligibleUser],
  );

  useEffect(() => {
    const size = eligibleUserIds.length;
    const prev = prevEligibleSizeRef.current;
    if (prev !== null && prev > 0 && size === 0 && users.length > 0) {
      pendingRoundEndRef.current = pickRankingChampion(users);
    }
    prevEligibleSizeRef.current = size;
  }, [eligibleUserIds, users]);

  const handleConfirmReset = useCallback(() => {
    resetSession();
    setModalWinner(null);
    setRankingSearchPreset(null);
    pendingRoundEndRef.current = null;
    setRoundEndChampion(null);
    setRoundEndModalOpen(false);
    setResetConfirmOpen(false);
  }, [resetSession]);

  const clearRankingSearchPreset = useCallback(() => {
    setRankingSearchPreset(null);
  }, []);

  const closeWinnerModal = useCallback(() => {
    setModalWinner(null);
    const c = pendingRoundEndRef.current;
    if (c) {
      pendingRoundEndRef.current = null;
      setRoundEndChampion(c);
      setRoundEndModalOpen(true);
    }
  }, []);

  const closeRoundEndModal = useCallback(() => {
    setRoundEndModalOpen(false);
    setRoundEndChampion(null);
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex min-h-[100dvh] flex-1 flex-col lg:min-h-0 lg:flex-row">
        <ParticipantsPanel
          participants={participants}
          onAddParticipant={addParticipant}
          onRequestNewRound={() => setResetConfirmOpen(true)}
          addParticipantDisabled={!canAddParticipant}
          novaRodadaDisabled={!canNovaRodada}
        />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center border-[#d4af37]/10 bg-gradient-to-b from-[#0a0e18]/95 via-[#0d111c] to-[#05070d]/95 py-6 lg:border-x lg:border-y-0">
          <header className="mb-2 text-center lg:mb-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[#c41e3a]/90">
              Cassino
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[#f5e6c8] sm:text-3xl">
              Roleta da rinha
            </h1>
          </header>
          <RouletteWheel
            participants={participants}
            onWinner={handleWinner}
            disabled={!canSpinRoulette}
          />
        </main>

        <UserRankSidebar
          users={users}
          onUpdateUserValue={updateUserValue}
          searchPreset={rankingSearchPreset}
          onClearSearchPreset={clearRankingSearchPreset}
        />
      </div>

      <WinnerModal winner={modalWinner} onClose={closeWinnerModal} />
      <RoundChampionModal
        open={roundEndModalOpen}
        champion={roundEndChampion}
        onClose={closeRoundEndModal}
      />
      <ConfirmResetModal
        open={resetConfirmOpen}
        onCancel={() => setResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <MesaControls />
    </div>
  );
}
