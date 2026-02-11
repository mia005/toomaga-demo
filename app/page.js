export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";

export default async function Page() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: loans, error } = await supabase
      .from("loans")
      .select("*");

    if (error) {
      console.error("Supabase error:", error);
      return <div>Database error.</div>;
    }

    return (
      <div>
        <h1>Toomaga Payment System</h1>
        <pre>{JSON.stringify(loans, null, 2)}</pre>
      </div>
    );
  } catch (err) {
    console.error("Server error:", err);
    return <div>Server error occurred.</div>;
  }
}
