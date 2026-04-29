import { describe, expect, it } from "vitest";
import { BADGES, getUnlockedBadges } from "../badges";

describe("getUnlockedBadges", () => {
  it("desbloqueia primeira-venda quando > 0", () => {
    const u = getUnlockedBadges(1);
    expect(u.find((b) => b.id === "primeira-venda")?.unlocked).toBe(true);
  });

  it("desbloqueia 1k em 1000", () => {
    const u = getUnlockedBadges(1000);
    expect(u.find((b) => b.id === "1k")?.unlocked).toBe(true);
    expect(u.find((b) => b.id === "5k")?.unlocked).toBe(false);
  });

  it("retorna lista do tamanho de BADGES", () => {
    expect(getUnlockedBadges(0)).toHaveLength(BADGES.length);
  });
});
