export function formatCurrency(cents: number): string {
  const value = cents / 100;

  if (value >= 1000000) {
    return "₱" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "₱" + (value / 1000).toFixed(1) + "K";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}
