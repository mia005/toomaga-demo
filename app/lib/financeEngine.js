export function currency(amount) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(amount);
}

/*
Loan Rules:

• 5% added immediately when approved
• 5% again every 12 months on remaining balance
• Term: 5 years
*/

export function applyInitialInterest(amount) {
  return amount * 1.05;
}

export function applyAnnualInterest(balance) {
  return balance * 1.05;
}
