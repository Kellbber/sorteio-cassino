"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type { User } from "./types";

export type SorteioFlags = {
  allowSpinRoulette: boolean;
  allowAddParticipant: boolean;
  allowNovaRodada: boolean;
};

const defaultFlags: SorteioFlags = {
  allowSpinRoulette: true,
  allowAddParticipant: true,
  allowNovaRodada: true,
};

export type SorteioStore = {
  users: User[];
  eligibleUserIds: string[];
  flags: SorteioFlags;

  addParticipant: (name: string, gameName: string) => void;
  removeEligibleUser: (userId: string) => void;
  updateUserValue: (userId: string, value: number) => void;
  resetSession: () => void;
  setFlag: <K extends keyof SorteioFlags>(key: K, value: SorteioFlags[K]) => void;
};

function sanitizeEligible(users: User[], eligibleUserIds: string[]): string[] {
  const ids = new Set(users.map((u) => u.id));
  return eligibleUserIds.filter((id) => ids.has(id));
}

function getSessionStorage(): StateStorage {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return sessionStorage;
}

export const useSorteioStore = create<SorteioStore>()(
  persist(
    (set) => ({
      users: [],
      eligibleUserIds: [],
      flags: { ...defaultFlags },

      addParticipant: (name, gameName) => {
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const trimmedName = name.trim();
        const trimmedGame = gameName.trim();
        const newUser: User = {
          id,
          name: trimmedName,
          gameName: trimmedGame,
          value: 0,
        };
        set((s) => ({
          users: [...s.users, newUser],
          eligibleUserIds: [...s.eligibleUserIds, id],
        }));
      },

      removeEligibleUser: (userId) => {
        set((s) => ({
          eligibleUserIds: s.eligibleUserIds.filter((id) => id !== userId),
        }));
      },

      updateUserValue: (userId, value) => {
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, value } : u)),
        }));
      },

      resetSession: () =>
        set({
          users: [],
          eligibleUserIds: [],
          flags: { ...defaultFlags },
        }),

      setFlag: (key, value) =>
        set((s) => ({
          flags: { ...s.flags, [key]: value },
        })),
    }),
    {
      name: "sorteio:mesa",
      storage: createJSONStorage(getSessionStorage),
      partialize: (state) => ({
        users: state.users,
        eligibleUserIds: state.eligibleUserIds,
        flags: state.flags,
      }),
      version: 1,
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        const fixed = sanitizeEligible(state.users, state.eligibleUserIds);
        if (fixed.length !== state.eligibleUserIds.length) {
          useSorteioStore.setState({ eligibleUserIds: fixed });
        }
      },
    },
  ),
);

/** Chame no cliente (ex.: `SorteioClient` em `useEffect`) para carregar o `sessionStorage`. */
export function rehydrateSorteioStore() {
  return useSorteioStore.persist.rehydrate();
}

export function selectParticipants(users: User[], eligibleUserIds: string[]): User[] {
  const set = new Set(eligibleUserIds);
  return users.filter((u) => set.has(u.id));
}

export function selectCanSpinRoulette(state: SorteioStore): boolean {
  return state.flags.allowSpinRoulette && state.eligibleUserIds.length > 0;
}

export function selectCanAddParticipant(state: SorteioStore): boolean {
  return state.flags.allowAddParticipant;
}

export function selectCanNovaRodada(state: SorteioStore): boolean {
  return state.flags.allowNovaRodada && state.users.length > 0;
}
