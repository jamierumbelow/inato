import { Drug, Pharmacy } from "./pharmacy";
import { loadExpectedDaysArray } from "./support/testUtilities";

describe("Pharmacy", () => {
  /**
   * Functional Tests
   */

  it("should decrease the benefit and expiresIn", () => {
    expect(new Pharmacy([new Drug("test", 2, 3)]).updateBenefitValue()).toEqual(
      [new Drug("test", 1, 2)]
    );
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
