"use client";

import { useEffect, useState } from "react";
import SummaryCards from "./components/SummaryCards";
import ChurchSummaryTable from "./components/ChurchSummaryTable";
import LoanListTable from "./components/LoanListTable";
import ActionBar from "./components/ActionBar";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [churches, setChurches] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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

  function toggleTheme() {
    setDarkMode(!darkMode);
    document.body.className = darkMode ? "light" : "dark";
  }

  return (
    <div style={containerStyle}>
      <h1>Toomaga Payment System</h1>

      <ActionBar toggleTheme={toggleTheme} darkMode={darkMode} />

      <SummaryCards loans={loans} />

      <ChurchSummaryTable loans={loans} churches={churches} />

      <LoanListTable
        loans={loans}
        churches={churches}
        onSelect={(loan) => alert("Open loan details")}
      />
    </div>
  );
}

const containerStyle = {
  padding: "40px",
};
