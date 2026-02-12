import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const today = new Date();

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("status", "ACTIVE");

  for (const loan of loans) {
    if (!loan.last_interest_date) continue;

    const lastInterest = new Date(loan.last_interest_date);

    const diffYears =
      (today - lastInterest) / (1000 * 60 * 60 * 24 * 365);

    if (diffYears >= 1 && loan.balance > 0) {
      const interestAmount =
        loan.balance * (loan.interest_rate / 100);

      const newBalance = loan.balance + interestAmount;

      await supabase
        .from("loans")
        .update({
          balance: newBalance,
          last_interest_date: today.toISOString(),
        })
        .eq("id", loan.id);

      console.log(
        `Interest applied to loan ${loan.loan_ref}`
      );
    }
  }

  return Response.json({ message: "Interest check completed" });
}
