/**
 * Nomes de jogos (slots) para combinar com as zoeiras.
 * Inclui títulos muito comuns em cassinos BR (ex.: Superbet: Pragmatic, PG Soft, NetEnt, Play'n GO).
 */
export const SUGGESTION_GAMES: readonly string[] = [
  "Athena",
  "Sweet Bonanza 1000",
  "Anubis",
  "Gate of Olympus",
  "Dead Dead or Deader",
  "Wanted Dead or a Wild",
  "The Dog House Megaways",
  "Fruit Party",
  "Fire Stampede",
  "Starlight Princess",
  "Dusk Princess",
  "Zeus vs Hades",
  "Gate of Olympus 1000 DICE",
  "Mines Rush",
  "Wolf Gold",
  "Monkey Mania 2",
  "Sugar Rush",
  "Big Bass Bonanza",
  "Fortune Tiger",
  "Book of Dead",
  "Starburst",
  "Buffalo King Megaways",
  "Gonzo's Quest",
  "Gates of Olympus 1000",
  "Money Train 4",
  "Sweet Bonanza",
  "Big Bass Splash",
  "Stack' em",
  "Shark Hunter",
  "Bonanza Megaways",
  "Great Rhino Megaways",
  "Madame Destiny Megaways",
  "Floating Dragon Megaways",
  "Gems Bonanza",
  "Wild Wild Riches",
  "The Dog House",
  "Fire in the Hole xBomb",
  "Extra Chilli",
  "Mustang Gold",
  "Wild West Gold",
  "Jammin' Jars",
  "Bigger Bass Bonanza",
  "Release the Kraken 2",
];

/** Começos de frase — sorteados separados do jogo. */
export const SUGGESTION_OPENINGS: readonly string[] = [
  "Quem tem filho de bigode é Jundiá! Mas tu é burro, burro, burro —",
  "Quer um jogo bacana…",
  "O cérebro liso que nem peito de frango…",
  "Eu tenho que ajudar? Sou obrigado? Já que tu é bocó —",
  "Cu de apertar linguiça…",
  "Eu tenho que andar cagado mesmo.",
  "Quer que eu escolha tuas cuecas também?",
  "Me pede um café também, o que acha?",
  "Onde apostar teu Bolsa Família?",
  "Já que tua vida é uma merda —",
  "Teu pai deve tá na zona…",
  "Deixa que eu vou te enriquecer, meu guri —",
  "Autoestima baixa, campeão? Por isso que é bronze.",
  "Amigão… pedir jogo não faz ela voltar — mas",
  "De gigante aqui só tua dívida no banco —",
  "Bateu a bad? Respira fundo e",
  "Tu não acerta nem o CEP —",
  "QI de temperatura ambiente —",
  "Hoje o loss vem com frete grátis —",
  "Nem cheat salva teu histórico —",
  "Sorte que cachorro não fala, senão contava tudo —",
  "Para de modinha pedindo sugestão e",
  "Tu acha que streamer é emprego? Enquanto isso —",
  "O tutorial te expulsou de casa —",
  "Se fosse sorte era loteria, mas é slot mesmo —",
];

/**
 * Como ligar abertura + jogo (também sorteado).
 * Primeira letra maiúscula onde faz sentido no meio da frase.
 */
export const SUGGESTION_CONNECTORS: readonly string[] = [
  "vai no",
  "vai nesse:",
  "pega o",
  "cola no",
  "manda ver no",
  "aposta o resto no",
  "despeja o saldo no",
  "rasga o cartão no",
  "sonha alto no",
  "finge que sabe e joga no",
  "coloca tudo (lá ele) no",
  "enterra a dignidade no",
  "faz bonito no",
  "tenta a sorte no",
];

function pick<T>(arr: readonly T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Monta uma frase aleatória: abertura + conector + jogo (todas as partes independentes).
 */
export function pickRandomGameSuggestion(): string {
  const game = pick(SUGGESTION_GAMES);
  const opening = pick(SUGGESTION_OPENINGS);
  const connector = pick(SUGGESTION_CONNECTORS);
  if (!game || !opening || !connector) return "";

  const tail = `${connector} ${game}`;
  return `${opening} ${tail}.`.replace(/\s+/g, " ").trim();
}
