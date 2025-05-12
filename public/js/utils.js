// Thus function returns the color that has proper contrast with the given hex color
export function getTextColorFromHex(hexColor) {
  if (hexColor.split('').includes('#')) hexColor = hexColor.substring(1);
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Calculate luminance using the WCAG formula (simplified)
  // Formula: (0.299*R + 0.587*G + 0.114*B)
  // Note: More accurate formulas exist considering gamma correction, but this is common.
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Threshold: 128 is a common midpoint for 0-255 range.
  // Colors with luminance > 128 are considered "light".
  return luminance > 128 ? 'black' : 'white';
}
