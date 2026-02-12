export function applyAnnualInterest(balance, interestRate = 5) {
  const interest = balance * (interestRate / 100);
  return balance + interest;
}
