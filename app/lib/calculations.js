export function calculateTotalOutstanding(loans) {
  return loans.reduce((sum, loan) => sum + (loan.balance || 0), 0);
}

export function calculateProjectedInterest(loans) {
  return loans.reduce(
    (sum, loan) =>
      sum + (loan.balance || 0) * ((loan.interest_rate || 0) / 100),
    0
  );
}

