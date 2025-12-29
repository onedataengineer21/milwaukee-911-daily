/**
 * Format large numbers with thousand separators
 * @param num - Number to format
 * @returns Formatted string (e.g., 1,234)
 */
export function formatNumber(num: number | string): string {
  const numValue = typeof num === 'string' ? parseInt(num, 10) : num;

  if (isNaN(numValue)) {
    return '0';
  }

  return numValue.toLocaleString('en-US');
}

/**
 * Format number with K/M suffix for very large numbers
 * @param num - Number to format
 * @returns Formatted string (e.g., 1.2K, 5.3M)
 */
export function formatNumberCompact(num: number | string): string {
  const numValue = typeof num === 'string' ? parseInt(num, 10) : num;

  if (isNaN(numValue)) {
    return '0';
  }

  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1) + 'M';
  } else if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1) + 'K';
  }

  return numValue.toString();
}
