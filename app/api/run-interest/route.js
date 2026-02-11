import { createClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .eq("status", "ACTIVE");

  const today = new Date();

  for (const loan of loans) {
    const lastDate = new Date(loan.last_interest_date || loan.start_date);
    const diffMonths =
      (today.getFullYear() - lastDate.getFullYear()) * 12 +
      (today.getMonth() - lastDate.getMonth());

    if (diffMonths >= 1) {
      const adminFee = Number(loan.balance) * 0.01; // 1% monthly admin
      const newBalance = Number(loan.balance) + adminFee;

      await supabase
        .from("loans")
        .update({
          balance: newBalance,
          last_interest_date: today,
        })
        .eq("id", loan.id);
    }
  }

  return Response.json({ message: "Monthly cron executed" });
}

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
