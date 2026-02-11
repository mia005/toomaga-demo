"use client";

import { useEffect, useState } from "react";
import SummaryCards from "./components/SummaryCards";
import LoanListTable from "./components/LoanListTable";
import ActionBar from "./components/ActionBar";

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [churches, setChurches] = useState([]);
  const [selectedChurch, setSelectedChurch] = useState("");

  useEffect(() => {
    // TEMP MOCK DATA
    setChurches([
      { id: "1", church_name: "EFKS Ranui" },
      { id: "2", church_name: "EFKS Kingsland" },
    ]);

    setLoans([
      {
        id: 1,
        loan_ref: "TMS-001",
        church_id: "1",
        church_name: "EFKS Ranui",
        principal: 10000,
        balance: 10012,
        interest_rate: 5,
      },
      {
        id: 2,
        loan_ref: "TMS-002",
        church_id: "2",
        church_name: "EFKS Kingsland",
        principal: 80000,
        balance: 58412,
        interest_rate: 5,
      },
    ]);
  }, []);

  const handleCreateLoan = () => {
    if (!selectedChurch) {
      alert("Please select a church first.");
      return;
    }

    alert("Loan creation logic goes here.");
  };

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

        <ActionBar
          churches={churches}
          selectedChurch={selectedChurch}
          setSelectedChurch={setSelectedChurch}
          onCreateLoan={handleCreateLoan}
        />

        <LoanListTable loans={loans} />
      </div>
    </div>
  );
}
