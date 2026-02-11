import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get ACTIVE loans
  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("status", "ACTIVE");

  for (const loan of loans || []) {
    const lastApplied = loan.last_admin_fee_date
      ? new Date(loan.last_admin_fee_date)
      : null;

    const alreadyChargedThisMonth =
      lastApplied &&
      lastApplied.getMonth() === currentMonth &&
      lastApplied.getFullYear() === currentYear;

    if (!alreadyChargedThisMonth) {
      const newBalance = Number(loan.balance) + 1;

      await supabase
        .from("loans")
        .update({
          balance: newBalance,
          last_admin_fee_date: today,
        })
        .eq("id", loan.id);
    }
  }

  return Response.json({ success: true });
}
