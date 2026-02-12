export function calculateRepaymentSchedule({
  principal,
  interestRate,
  termMonths,
  adminFeeMonthly = 1,
}) {
  const monthlyInterestRate = interestRate / 100 / 12;

  const monthlyPayment =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, termMonths)) /
    (Math.pow(1 + monthlyInterestRate, termMonths) - 1);

  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyInterestRate;
    const principalPaid = monthlyPayment - interest;
    balance -= principalPaid;

    schedule.push({
      month,
      payment: monthlyPayment + adminFeeMonthly,
      principalPaid,
      interest,
      adminFee: adminFeeMonthly,
      remainingBalance: balance > 0 ? balance : 0,
    });
  }

  return schedule;
}
