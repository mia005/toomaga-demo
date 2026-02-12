import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Run admin fee
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/run-admin-fee`, {
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

  // Run interest
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/run-interest`, {
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

  return Response.json({ success: true });
}
