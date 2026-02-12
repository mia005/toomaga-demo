import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const today = new Date();

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("status", "ACTIVE");

  for (const loan of loans || []) {
    // Monthly Admin Fee
    const lastAdmin = loan.last_admin_fee_date
      ? new Date(loan.last_admin_fee_date)
      : null;

    const oneMonthLater = lastAdmin
      ? new Date(lastAdmin.setMonth(lastAdmin.getMonth() + 1))
      : null;

    if (!loan.last_admin_fee_date || today >= oneMonthLater) {
      const adminAmount =
        (Number(loan.balance) * Number(loan.admin_fee)) / 100;

      await supabase
        .from("loans")
        .update({
          balance: Number(loan.balance) + adminAmount,
          last_admin_fee_date: today,
        })
        .eq("id", loan.id);
    }

    // Yearly Interest
    const lastInterest = loan.last_interest_date
      ? new Date(loan.last_interest_date)
      : null;

    const oneYearLater = lastInterest
      ? new Date(lastInterest.setFullYear(lastInterest.getFullYear() + 1))
      : null;

    if (!loan.last_interest_date || today >= oneYearLater) {
      const interestAmount =
        (Number(loan.balance) * Number(loan.interest_rate)) / 100;

      await supabase
        .from("loans")
        .update({
          balance: Number(loan.balance) + interestAmount,
          last_interest_date: today,
        })
        .eq("id", loan.id);
    }
  }

  return Response.json({ success: true });
}
