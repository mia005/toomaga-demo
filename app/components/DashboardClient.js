"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SummaryCards from "./SummaryCards";
import LoanListTable from "./LoanListTable";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DashboardClient() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    const { data } = await supabase.from("loans").select("*");
    setLoans(data || []);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Toomaga Payment System</h1>

      <SummaryCards loans={loans} />
      <LoanListTable loans={loans} />
    </div>
  );
}
