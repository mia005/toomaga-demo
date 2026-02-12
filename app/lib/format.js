export function currency(value) {
  if (!value) return "$0.00";

  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(Number(value));
}
