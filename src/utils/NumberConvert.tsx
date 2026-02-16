export function toNepaliNumber<T extends string | number>(input: T): string {
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

  return input
    .toString()
    .split("")
    .map((char) =>
      /\d/.test(char) ? nepaliDigits[Number.parseInt(char)] : char
    )
    .join("");
}

// Helper function for formatting large numbers in Nepali
export function formatNepaliNumber(num: number): string {
  return toNepaliNumber(num.toLocaleString("en-US"));
}

// Helper function for percentage formatting in Nepali
export function toNepaliPercentage(percentage: number): string {
  return `${toNepaliNumber(percentage.toFixed(1))}%`;
}
