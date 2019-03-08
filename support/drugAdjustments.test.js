import { calculateNewBenefit } from "./drugAdjustments";

describe("calculateNewBenefit", () => {
  describe("Herbal Tea", () => {
    itNeverGoesAbove50("Herbal Tea");
  });

  describe("Magic Pill", () => {
    it("always stays the same", () => {
      expect(calculateNewBenefit("Magic Pill", 10)).toEqual(10);
      expect(calculateNewBenefit("Magic Pill", 11)).toEqual(11);
      expect(calculateNewBenefit("Magic Pill", 11, 1)).toEqual(11);
      expect(calculateNewBenefit("Magic Pill", 12, 0)).toEqual(12);
    });
  });

  describe("Fervex", () => {
    itNeverGoesAbove50("Fervex");

    it("increases its benefit by 2 when there are 10 days or less", () => {
      expect(calculateNewBenefit("Fervex", 10, 11)).toEqual(11);
      expect(calculateNewBenefit("Fervex", 10, 10)).toEqual(12);
      expect(calculateNewBenefit("Fervex", 16, 6)).toEqual(18);
    });

    it("increases its benefit by 3 when there are 5 days or less", () => {
      expect(calculateNewBenefit("Fervex", 8, 6)).toEqual(10);
      expect(calculateNewBenefit("Fervex", 10, 5)).toEqual(13);
      expect(calculateNewBenefit("Fervex", 30, 1)).toEqual(33);
    });
  });

  describe("Doliprane", () => {
    itNeverGoesBelow0("Doliprane");
  });
});

function itNeverGoesAbove50(drugName) {
  it("never goes above 50", () => {
    expect(calculateNewBenefit(drugName, 49, 10)).toEqual(50);
    expect(calculateNewBenefit(drugName, 50, 5)).toEqual(50);
    expect(calculateNewBenefit(drugName, 51, 2)).toEqual(50);
  });
}

function itNeverGoesBelow0(drugName) {
  it("never goes below 0", () => {
    expect(calculateNewBenefit(drugName, 1, 10)).toEqual(0);
    expect(calculateNewBenefit(drugName, 0, 5)).toEqual(0);
    expect(calculateNewBenefit(drugName, -1, 2)).toEqual(0);
  });
}
