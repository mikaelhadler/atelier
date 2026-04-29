import { describe, expect, it } from "vitest";
import { calculatePrice } from "../pricing";

describe("calculatePrice", () => {
  it("soma material + mão de obra + margem", () => {
    const result = calculatePrice({
      materials: [
        { label: "linha", value: 10 },
        { label: "tecido", value: 20 },
      ],
      hours: 2,
      hourlyRate: 25,
      marginPercent: 30,
      taxPercent: 0,
      shipping: 0,
    });
    expect(result.materialsTotal).toBe(30);
    expect(result.laborTotal).toBe(50);
    expect(result.subtotal).toBe(80);
    expect(result.marginValue).toBeCloseTo(24, 2);
    expect(result.suggestedPrice).toBeCloseTo(104, 2);
  });

  it("aplica imposto sobre subtotal+margem", () => {
    const result = calculatePrice({
      materials: [{ label: "x", value: 100 }],
      hours: 0,
      hourlyRate: 0,
      marginPercent: 0,
      taxPercent: 6,
      shipping: 0,
    });
    expect(result.taxValue).toBeCloseTo(6, 2);
    expect(result.suggestedPrice).toBeCloseTo(106, 2);
  });

  it("inclui frete no preço final", () => {
    const result = calculatePrice({
      materials: [{ label: "x", value: 100 }],
      hours: 0,
      hourlyRate: 0,
      marginPercent: 0,
      taxPercent: 0,
      shipping: 25,
    });
    expect(result.shipping).toBe(25);
    expect(result.suggestedPrice).toBeCloseTo(125, 2);
  });

  it("retorna zero quando inputs vazios", () => {
    const result = calculatePrice({
      materials: [],
      hours: 0,
      hourlyRate: 0,
      marginPercent: 0,
      taxPercent: 0,
      shipping: 0,
    });
    expect(result.suggestedPrice).toBe(0);
  });

  it("ignora itens com value não-finito", () => {
    const result = calculatePrice({
      materials: [
        { label: "x", value: NaN },
        { label: "y", value: 5 },
      ],
      hours: 0,
      hourlyRate: 0,
      marginPercent: 0,
      taxPercent: 0,
      shipping: 0,
    });
    expect(result.materialsTotal).toBe(5);
  });
});
