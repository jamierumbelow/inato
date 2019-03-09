import { calculateNewBenefit, calculateNewExpiresIn } from "./drugAdjustments";

describe("calculateNewBenefit", () => {
  describe("Herbal Tea", () => {
    itNeverGoesAbove50("Herbal Tea");

    it("increases in benefit", () => {
      expect(calculateNewBenefit("Herbal Tea", 10)).toEqual(11);
    });

    // @todo bug or undocumented feature?
    it("increases in benefit by 2 after expiry", () => {
      expect(calculateNewBenefit("Herbal Tea", 10, 1)).toEqual(11);
      expect(calculateNewBenefit("Herbal Tea", 10, 0)).toEqual(12);
      expect(calculateNewBenefit("Herbal Tea", 5, -2)).toEqual(7);
    });
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

    it("resets its benefit to 0 when expired", () => {
      expect(calculateNewBenefit("Fervex", 1, 1)).toEqual(4);
      expect(calculateNewBenefit("Fervex", 1, 0)).toEqual(0);
      expect(calculateNewBenefit("Fervex", 50, 0)).toEqual(0);
    });
  });

  describe("Doliprane", () => {
    itNeverGoesBelow0("Doliprane");

    it("decreases benefit at a faster rate after expiry", () => {
      expect(calculateNewBenefit("Doliprane", 10, 1)).toEqual(9);
      expect(calculateNewBenefit("Doliprane", 10, 0)).toEqual(8);
      expect(calculateNewBenefit("Doliprane", 6, -1)).toEqual(4);
    });
  });
});

describe("calculateNewExpiresIn", () => {
  describe("Magic Pill", () => {
    it("doesn't expire", () => {
      expect(calculateNewExpiresIn("Magic Pill", 100)).toEqual(100);
      expect(calculateNewExpiresIn("Magic Pill", 10)).toEqual(10);
      expect(calculateNewExpiresIn("Magic Pill", 1)).toEqual(1);
      expect(calculateNewExpiresIn("Magic Pill", 0)).toEqual(0);
    });
  });

  describe("everything else", () => {
    itExpires("Herbal Tea");
    itExpires("Fervex");
    itExpires("Doliprane");
  });
});

/**
 * Drug adjustment-specific assertions
 */

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

function itExpires(drugName) {
  describe(drugName, () => {
    it("expires", () => {
      expect(calculateNewExpiresIn(drugName, 100)).toEqual(99);
      expect(calculateNewExpiresIn(drugName, 10)).toEqual(9);
      expect(calculateNewExpiresIn(drugName, 1)).toEqual(0);
      expect(calculateNewExpiresIn(drugName, 0)).toEqual(-1);
      expect(calculateNewExpiresIn(drugName, -5)).toEqual(-6);
    });
  });
}
