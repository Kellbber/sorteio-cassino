/** Rótulo único para busca e exibição: "Nome · Jogo". */
export function formatParticipantSearchLabel(u: {
  name: string;
  gameName: string;
}): string {
  return `${u.name.trim()} · ${u.gameName.trim()}`;
}

/** Mesmo nome + mesmo jogo (ignora maiúsculas e espaços nas pontas). */
export function sameParticipantPair(
  a: { name: string; gameName: string },
  b: { name: string; gameName: string },
): boolean {
  return (
    a.name.trim().toLowerCase() === b.name.trim().toLowerCase() &&
    a.gameName.trim().toLowerCase() === b.gameName.trim().toLowerCase()
  );
}
