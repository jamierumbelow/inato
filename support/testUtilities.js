import fs from "fs";

/**
 * Given the Inato output.txt, separate out each day's array, format it
 * and parse the JSON.
 *
 * @return []object
 */
export function loadExpectedDaysArray() {
  const inatoOutput = fs.readFileSync("./output.txt", "utf8");
  const expectedDays = inatoOutput.split("],");

  // Map over the array and append a closing square brace
  return expectedDays.map((expectedDay, i) => {
    return JSON.parse(
      i < expectedDays.length - 1 ? `${expectedDay}]` : expectedDay
    );
  });
}
