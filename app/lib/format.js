export const currency = (amount) => {
  if (!amount) return "$0.00";
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(amount);
};
