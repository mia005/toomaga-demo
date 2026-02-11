export function calculateTotal(principal, adminFee) {
  return principal + adminFee;
}
export const calculateLoanBalance = (loan, payments = []) => {
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
  return loan.principal + loan.admin_fee - totalPayments;
};

export const calculateProjectedInterest = (loan) => {
  return (loan.balance || 0) * (loan.interest_rate / 100);
};
