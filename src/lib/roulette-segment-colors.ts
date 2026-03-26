/** Cores das fatias da roleta (mesma ordem do gradiente cônico). */
export const ROULETTE_SEGMENT_COLORS = [
  "#6b0f1a",
  "#4a1d6b",
  "#0d4f4a",
  "#6b4a0f",
  "#1a3a6b",
  "#6b1a4a",
  "#2d5016",
  "#4a2c1a",
] as const;

export function getRouletteSegmentColor(index: number): string {
  return ROULETTE_SEGMENT_COLORS[index % ROULETTE_SEGMENT_COLORS.length];
}

export function buildRouletteConicGradient(count: number): string {
  if (count <= 0) {
    return "conic-gradient(from 0deg, #1c1917 0deg, #292524 360deg)";
  }
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const start = (i / count) * 360;
    const end = ((i + 1) / count) * 360;
    parts.push(
      `${getRouletteSegmentColor(i)} ${start}deg ${end}deg`,
    );
  }
  return `conic-gradient(from 0deg, ${parts.join(", ")})`;
}
