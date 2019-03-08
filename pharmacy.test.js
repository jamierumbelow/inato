import { Drug, Pharmacy } from "./pharmacy";
import { loadExpectedDaysArray } from "./support/testUtilities";

describe("Pharmacy", () => {
  /**
   * Functional Tests
   */

  describe("system specifications", () => {
    // The Benefit of an item is never negative.
    // "Herbal Tea" actually increases in Benefit the older it gets,
    // The Benefit of an item is never more than 50.
    // "Magic Pill" never expires nor decreases in Benefit.
    // "Fervex", like Herbal Tea, increases in Benefit as its expiration date approaches. Benefit increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but Benefit drops to 0 after the expiration date.
  });

  describe("updateBenefitValue", () => {
    // Once the expiration date has passed, Benefit degrades twice as fast.
    it("should degrade benefit by two when the expiration date has passed, once otherwise", () => {
      // One day away from expiration, benefit = 10 -> new benefit = 9
      expect(
        new Pharmacy([new Drug("test", 1, 10)]).updateBenefitValue()
      ).toEqual([new Drug("test", 0, 9)]);

      // Expiration date, benefit = 9 -> new benefit = 7
      expect(
        new Pharmacy([new Drug("test", 0, 9)]).updateBenefitValue()
      ).toEqual([new Drug("test", -1, 7)]);
    });

    // @deprecated
    it("should decrease the benefit and expiresIn", () => {
      expect(
        new Pharmacy([new Drug("test", 2, 3)]).updateBenefitValue()
      ).toEqual([new Drug("test", 1, 2)]);
    });
  });

  /**
   * Sanity check: does the relevant output match the Inato-generated output.txt?
   */

  it("should export similarly to output.txt", () => {
    const expectedDays = loadExpectedDaysArray();

    // Loop through the expected days, taken from the output.txt. Each row, when
    // updateBenefitValue() is called, should return the subsequent row (apart
    // from the last row, of course.)
    expectedDays.slice(0, expectedDays.length - 1).forEach((expectedDay, i) => {
      expect(new Pharmacy(expectedDay).updateBenefitValue()).toEqual(
        expectedDays[i + 1]
      );
    });
  });
});
