"use client";

import { useEffect, useState } from "react";
import SummaryCards from "./components/SummaryCards";
import LoanListTable from "./components/LoanListTable";

export default function Dashboard() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    // TEMP MOCK DATA (replace with Supabase later)
    setLoans([
      {
        id: 1,
        loan_ref: "TMS-001",
        church_name: "EFKS Ranui",
        principal: 10000,
        balance: 10012,
        interest_rate: 5,
      },
      {
        id: 2,
        loan_ref: "TMS-002",
        church_name: "EFKS Kingsland",
        principal: 80000,
        balance: 58412,
        interest_rate: 5,
      },
    ]);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "30px",
          }}
        >
          Toomaga Payment System
        </h1>

        <SummaryCards loans={loans} />

        <LoanListTable loans={loans} />
      </div>
    </div>
  );
}
