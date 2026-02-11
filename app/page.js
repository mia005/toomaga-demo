"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SummaryCards from "./components/SummaryCards";
import ChurchSummaryTable from "./components/ChurchSummaryTable";
import LoanListTable from "./components/LoanListTable";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [churches, setChurches] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: loansData } = await supabase
      .from("loans")
      .select("*");

    const { data: churchesData } = await supabase
      .from("churches")
      .select("*");

    setLoans(loansData || []);
    setChurches(churchesData || []);
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: "40px" }}>
        Toomaga Payment System
      </h1>

      <SummaryCards loans={loans} />

      <ChurchSummaryTable loans={loans} churches={churches} />

      <LoanListTable loans={loans} churches={churches} />
    </div>
  );
}

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px",
  background: "#f5f7fa",
  minHeight: "100vh",
};
