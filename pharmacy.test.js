import { Drug, Pharmacy } from "./pharmacy";
import { loadExpectedDaysArray } from "./support/testUtilities";

describe("Pharmacy", () => {
  /**
   * Functional Tests
   */

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

    // "Magic Pill" never expires nor decreases in Benefit.
    describe("Magic Pill", () => {
      it("neither increases nor decreases its benefit", () => {
        expect(
          new Pharmacy([new Drug("Magic Pill", 10, 15)]).updateBenefitValue()
        ).toEqual([new Drug("Magic Pill", 10, 15)]);
        expect(
          new Pharmacy([new Drug("Magic Pill", 9, 15)]).updateBenefitValue()
        ).toEqual([new Drug("Magic Pill", 9, 15)]);
        expect(
          new Pharmacy([new Drug("Magic Pill", 0, 12)]).updateBenefitValue()
        ).toEqual([new Drug("Magic Pill", 0, 12)]);
      });
    });

    // "Fervex", like Herbal Tea, increases in Benefit as its expiration date approaches.
    // Benefit increases by 2 when there are 10 days or less and by 3 when there
    // are 5 days or less but Benefit drops to 0 after the expiration date.
    describe("Fervex", () => {
      it("increases its benefit by 2 when there are 10 days or less", () => {
        expect(
          new Pharmacy([new Drug("Fervex", 11, 15)]).updateBenefitValue()
        ).toEqual([new Drug("Fervex", 10, 16)]);
        expect(
          new Pharmacy([new Drug("Fervex", 10, 14)]).updateBenefitValue()
        ).toEqual([new Drug("Fervex", 9, 16)]);
        expect(
          new Pharmacy([new Drug("Fervex", 9, 10)]).updateBenefitValue()
        ).toEqual([new Drug("Fervex", 8, 12)]);
      });

      it("increases its benefit by 3 when there are 5 days or less", () => {
        expect(
          new Pharmacy([new Drug("Fervex", 6, 15)]).updateBenefitValue()
        ).toEqual([new Drug("Fervex", 5, 17)]);
        expect(
          new Pharmacy([new Drug("Fervex", 5, 14)]).updateBenefitValue()
        ).toEqual([new Drug("Fervex", 4, 17)]);
        expect(
          new Pharmacy([new Drug("Fervex", 1, 10)]).updateBenefitValue()
        ).toEqual([new Drug("Fervex", 0, 13)]);
      });

      it("can't jump above 50", () => {
        expect(
          new Pharmacy([new Drug("Fervex", 7, 49)]).updateBenefitValue()
        ).toEqual([new Drug("Fervex", 6, 50)]);
        expect(
          new Pharmacy([new Drug("Fervex", 1, 49)]).updateBenefitValue()
        ).toEqual([new Drug("Fervex", 0, 50)]);
      });
    });

    // "Dafalgan" degrades in Benefit twice as fast as normal
    describe("Dafalgan", () => {
      it("degrades in benefit twice as fast as normal", () => {
        expect(
          new Pharmacy([new Drug("Dafalgan", 7, 49)]).updateBenefitValue()
        ).toEqual([new Drug("Dafalgan", 6, 47)]);
        expect(
          new Pharmacy([new Drug("Dafalgan", 1, 1)]).updateBenefitValue()
        ).toEqual([new Drug("Dafalgan", 0, 0)]);
      });
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
