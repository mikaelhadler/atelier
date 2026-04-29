export type Material = { label: string; value: number };

export type PricingInput = {
  materials: Material[];
  hours: number;
  hourlyRate: number;
  marginPercent: number;
  taxPercent: number;
  shipping: number;
};

export type PricingResult = {
  materialsTotal: number;
  laborTotal: number;
  subtotal: number;
  marginValue: number;
  taxValue: number;
  shipping: number;
  suggestedPrice: number;
};

export function calculatePrice(input: PricingInput): PricingResult {
  const materialsTotal = input.materials.reduce(
    (acc, m) => acc + (Number.isFinite(m.value) ? m.value : 0),
    0,
  );
  const laborTotal = (input.hours || 0) * (input.hourlyRate || 0);
  const subtotal = materialsTotal + laborTotal;
  const marginValue = subtotal * ((input.marginPercent || 0) / 100);
  const baseWithMargin = subtotal + marginValue;
  const taxValue = baseWithMargin * ((input.taxPercent || 0) / 100);
  const shipping = Number.isFinite(input.shipping) ? input.shipping : 0;
  const suggestedPrice = baseWithMargin + taxValue + shipping;
  return {
    materialsTotal,
    laborTotal,
    subtotal,
    marginValue,
    taxValue,
    shipping,
    suggestedPrice,
  };
}
