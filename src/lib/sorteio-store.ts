"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import { sameParticipantPair } from "./participant-identity";
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

  /** `false` se já existir o par nome+jogo. */
  addParticipant: (name: string, gameName: string) => boolean;
  removeEligibleUser: (userId: string) => void;
  /** Remove o cadastro: sai do sorteio e do ranking. */
  removeUser: (userId: string) => void;
  /** `false` se outro usuário já tiver o mesmo nome+jogo. */
  updateUser: (
    userId: string,
    updates: Partial<Pick<User, "name" | "gameName">>,
  ) => boolean;
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
    (set, get) => ({
      users: [],
      eligibleUserIds: [],
      flags: { ...defaultFlags },

      addParticipant: (name, gameName) => {
        const trimmedName = name.trim();
        const trimmedGame = gameName.trim();
        const dup = get().users.some((u) =>
          sameParticipantPair(u, { name: trimmedName, gameName: trimmedGame }),
        );
        if (dup) return false;
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
        return true;
      },

      removeEligibleUser: (userId) => {
        set((s) => ({
          eligibleUserIds: s.eligibleUserIds.filter((id) => id !== userId),
        }));
      },

      removeUser: (userId) => {
        set((s) => ({
          users: s.users.filter((u) => u.id !== userId),
          eligibleUserIds: s.eligibleUserIds.filter((id) => id !== userId),
        }));
      },

      updateUser: (userId, updates) => {
        const s = get();
        const target = s.users.find((u) => u.id === userId);
        if (!target) return false;
        const nextName =
          updates.name !== undefined ? updates.name.trim() : target.name;
        const nextGame =
          updates.gameName !== undefined
            ? updates.gameName.trim()
            : target.gameName;
        const dup = s.users.some(
          (u) =>
            u.id !== userId &&
            sameParticipantPair(u, { name: nextName, gameName: nextGame }),
        );
        if (dup) return false;
        set((st) => ({
          users: st.users.map((u) => {
            if (u.id !== userId) return u;
            return {
              ...u,
              name: nextName,
              gameName: nextGame,
            };
          }),
        }));
        return true;
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
