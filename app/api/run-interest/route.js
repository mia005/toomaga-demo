import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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
    const lastInterestDate = loan.last_interest_date
      ? new Date(loan.last_interest_date)
      : new Date(loan.start_date);

    const nextInterestDate = new Date(lastInterestDate);
    nextInterestDate.setMonth(nextInterestDate.getMonth() + 12);

    if (today >= nextInterestDate) {
      const interestAmount = loan.balance * (loan.interest_rate / 100);

      const newBalance = Number(loan.balance) + Number(interestAmount);

      await supabase
        .from("loans")
        .update({
          balance: newBalance,
          last_interest_date: today,
        })
        .eq("id", loan.id);
    }
  }

  return Response.json({ success: true });
}
