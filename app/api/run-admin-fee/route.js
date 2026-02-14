export const dynamic = "force-dynamic";

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
    if (!loan.last_admin_fee_date) {
      await supabase
        .from("loans")
        .update({
          balance: loan.balance + 1,
          last_admin_fee_date: today,
        })
        .eq("id", loan.id);

      continue;
    }

    const last = new Date(loan.last_admin_fee_date);
    const diffMonths =
      (today.getFullYear() - last.getFullYear()) * 12 +
      (today.getMonth() - last.getMonth());

    if (diffMonths >= 1) {
      await supabase
        .from("loans")
        .update({
          balance: loan.balance + 1,
          last_admin_fee_date: today,
        })
        .eq("id", loan.id);
    }
  }

  return Response.json({ success: true });
}
