export type Tier = "S" | "A" | "B" | "C" | "D";

export const TIER_ORDER: Tier[] = ["S", "A", "B", "C", "D"];

export const TIER_TO_NUMBER: Record<Tier, number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 1,
};

export const TIER_COLORS: Record<Tier, string> = {
  S: "#f97316", // laranja forte
  A: "#eab308", // amarelo
  B: "#22c55e", // verde
  C: "#3b82f6", // azul
  D: "#6b7280", // cinza
};

/**
 * Converte a média numérica dos votos de volta para o tier mais próximo.
 * Ex: média 4.6 -> arredonda pra 5 -> "S"
 */
export function averageToTier(average: number): Tier {
  const rounded = Math.round(average);
  const clamped = Math.min(5, Math.max(1, rounded));
  const entry = Object.entries(TIER_TO_NUMBER).find(
    ([, value]) => value === clamped
  );
  return (entry?.[0] as Tier) ?? "D";
}

/**
 * Calcula o tier final de um membro a partir da lista de tiers recebidos.
 * Retorna null se não houver nenhum voto ainda.
 */
export const TIER_LABELS: Record<Tier, string> = {
  S: "Lendário",
  A: "Elite",
  B: "Confiável",
  C: "Em ascensão",
  D: "Iniciante",
};

export function calculateFinalTier(votes: Tier[]): {
  tier: Tier | null;
  average: number | null;
} {
  if (votes.length === 0) return { tier: null, average: null };

  const sum = votes.reduce((acc, t) => acc + TIER_TO_NUMBER[t], 0);
  const average = sum / votes.length;

  return { tier: averageToTier(average), average };
}
