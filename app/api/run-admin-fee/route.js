import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    // 🔐 Security check (optional but recommended)
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    // ✅ Create Supabase client INSIDE function
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ==============================
    // Get Active Loans
    // ==============================
    const { data: loans, error } = await supabase
      .from("loans")
      .select("*")
      .eq("status", "ACTIVE");

    if (error) {
      return new Response(JSON.stringify(error), { status: 500 });
    }

    if (!loans || loans.length === 0) {
      return new Response("No active loans found", { status: 200 });
    }

    // ==============================
    // Apply Admin Fee
    // ==============================
    for (const loan of loans) {
      const newBalance = Number(loan.balance) + Number(loan.admin_fee);

      await supabase
        .from("loans")
        .update({ balance: newBalance })
        .eq("id", loan.id);
    }

    return new Response("Admin fee applied successfully", { status: 200 });

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
