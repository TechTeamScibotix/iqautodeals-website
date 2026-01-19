/**
 * Format a price for display.
 * Returns "Call For Price" if price is null, undefined, 0, or falsy.
 * Otherwise returns formatted price with $ and comma separators.
 */
export function formatPrice(price: number | null | undefined): string {
  if (!price || price <= 0) {
    return 'Call For Price';
  }
  return `$${price.toLocaleString()}`;
}
