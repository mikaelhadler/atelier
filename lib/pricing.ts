export type Material = { label: string; value: number };
export type PricingInput = {
  materials: Material[];
  hours: number;
  hourlyRate: number;
  marginPercent: number;
};
export type PricingResult = {
  materialsTotal: number;
  laborTotal: number;
  subtotal: number;
  suggestedPrice: number;
};

export function calculatePrice(input: PricingInput): PricingResult {
  const materialsTotal = input.materials.reduce(
    (acc, m) => acc + (Number.isFinite(m.value) ? m.value : 0),
    0,
  );
  const laborTotal = (input.hours || 0) * (input.hourlyRate || 0);
  const subtotal = materialsTotal + laborTotal;
  const suggestedPrice = subtotal * (1 + (input.marginPercent || 0) / 100);
  return { materialsTotal, laborTotal, subtotal, suggestedPrice };
}
