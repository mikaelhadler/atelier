export type Badge = {
  id: string;
  label: string;
  threshold: number;
  emoji: string;
};

export const BADGES: Badge[] = [
  { id: "primeira-venda", label: "Primeira venda", threshold: 1, emoji: "🎉" },
  { id: "1k", label: "R$1.000 mensal", threshold: 1000, emoji: "🌱" },
  { id: "5k", label: "R$5.000 mensal", threshold: 5000, emoji: "🌟" },
  { id: "10k", label: "R$10.000 mensal", threshold: 10000, emoji: "🏆" },
];

export function getUnlockedBadges(totalMonthlyRevenue: number) {
  return BADGES.map((b) => ({ ...b, unlocked: totalMonthlyRevenue >= b.threshold }));
}
