import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("status", "ACTIVE");

  const today = new Date();

  for (const loan of loans) {
    const lastInterest = new Date(loan.last_interest_date);
    const diffMonths =
      (today.getFullYear() - lastInterest.getFullYear()) * 12 +
      (today.getMonth() - lastInterest.getMonth());

    if (diffMonths >= 12) {
      const interest = loan.balance * 0.05;
      const newBalance = loan.balance + interest;

      await supabase
        .from("loans")
        .update({
          balance: newBalance,
          last_interest_date: today,
        })
        .eq("id", loan.id);
    }
  }

  return Response.json({ message: "Interest engine executed" });
}
