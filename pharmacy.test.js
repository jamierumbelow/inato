import { Drug, Pharmacy } from "./pharmacy";
import { loadExpectedDaysArray } from "./support/testUtilities";

describe("Pharmacy", () => {
  /**
   * Functional Tests
   */

  describe("system specifications", () => {
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

    // The benefit of an item is never negative
    it("should never allow a negative benefit", () => {
      expect(
        new Pharmacy([new Drug("test", 10, 0)]).updateBenefitValue()
      ).toEqual([new Drug("test", 9, 0)]);
      expect(
        new Pharmacy([new Drug("test", 0, 0)]).updateBenefitValue()
      ).toEqual([new Drug("test", -1, 0)]);
    });

    // The benefit of an item is never more than 50.
    it("should never allow a benefit greater than 50", () => {
      expect(
        new Pharmacy([new Drug("Herbal Tea", 5, 49)]).updateBenefitValue()
      ).toEqual([new Drug("Herbal Tea", 4, 50)]);
      expect(
        new Pharmacy([new Drug("Herbal Tea", 4, 50)]).updateBenefitValue()
      ).toEqual([new Drug("Herbal Tea", 3, 50)]);
    });

    // "Herbal Tea" actually increases in benefit the older it gets
    describe("Herbal Tea", () => {
      it("increases in benefit the older it gets", () => {
        expect(
          new Pharmacy([new Drug("Herbal Tea", 10, 1)]).updateBenefitValue()
        ).toEqual([new Drug("Herbal Tea", 9, 2)]);
        expect(
          new Pharmacy([new Drug("Herbal Tea", 9, 2)]).updateBenefitValue()
        ).toEqual([new Drug("Herbal Tea", 8, 3)]);
      });
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
