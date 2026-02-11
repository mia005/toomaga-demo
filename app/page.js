"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [churches, setChurches] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn]);

  async function fetchData() {
    const { data: churchesData } = await supabase.from("churches").select("*");
    const { data: loansData } = await supabase.from("loans").select("*");

    setChurches(churchesData || []);
    setLoans(loansData || []);
  }

  // ================= LOGIN =================

  function handleLogin() {
    const email = prompt("Enter Email");
    const password = prompt("Enter Password");

    if (email === "admin@toomaga.nz" && password === "demo123") {
      setLoggedIn(true);
    } else {
      alert("Invalid credentials (Demo: admin@toomaga.nz / demo123)");
    }
  }

  if (!loggedIn) {
    return (
      <div style={loginWrapper}>
        <div style={loginCard}>
          <h2>Toomaga Payment System</h2>
          <p>Admin Login</p>
          <button style={btnStyle} onClick={handleLogin}>
            Login
          </button>
          <p style={{ fontSize: 12, marginTop: 15 }}>
            Demo: admin@toomaga.nz / demo123
          </p>
        </div>
      </div>
    );
  }

  // ================= ACTIONS =================

  async function createLoan() {
    const churchId = prompt("Enter Church ID");
    const amount = Number(prompt("Enter Loan Amount"));

    if (!churchId || !amount) return;

    if (amount > 80000) {
      alert("Loan cannot exceed $80,000");
      return;
    }

    const openingBalance = amount + 120;

    await supabase.from("loans").insert([
      {
        church_id: churchId,
        principal: amount,
        admin_fee: 120,
        balance: openingBalance,
        loan_ref: "TMS-" + Date.now(),
        start_date: new Date()
      }
    ]);

    fetchData();
  }

  async function addPayment() {
    const loanId = prompt("Enter Loan ID");
    const amount = Number(prompt("Enter Payment Amount"));

    if (!loanId || !amount) return;

    const { data: loan } = await supabase
      .from("loans")
      .select("*")
      .eq("id", loanId)
      .single();

    if (!loan) return;

    const newBalance = loan.balance - amount;

    await supabase.from("payments").insert([
      { loan_id: loanId, amount, payment_date: new Date() }
    ]);

    await supabase.from("loans")
      .update({ balance: newBalance })
      .eq("id", loanId);

    fetchData();
  }

  async function applyInterest() {
    const loanId = prompt("Enter Loan ID");

    if (!loanId) return;

    const { data: loan } = await supabase
      .from("loans")
      .select("*")
      .eq("id", loanId)
      .single();

    if (!loan) return;

    const interestAmount = loan.balance * 0.05;
    const newBalance = loan.balance + interestAmount;

    await supabase.from("loans")
      .update({ balance: newBalance })
      .eq("id", loanId);

    fetchData();
  }

  // ================= EXPORT FUNCTIONS =================

  function exportCSV(data, filename) {
    if (!data.length) return alert("No data available");

    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(h => `"${row[h] ?? ""}"`).join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  function exportFullPortfolio() {
    const portfolio = loans.map(l => ({
      LoanID: l.id,
      Principal: l.principal,
      Balance: l.balance,
      AdminFee: l.admin_fee
    }));

    exportCSV(portfolio, "Toomaga_Full_Portfolio.csv");
  }

  async function generateLoanReport() {
    const loanId = prompt("Enter Loan ID");
    if (!loanId) return;

    const { data: loan } = await supabase
      .from("loans")
      .select("*")
      .eq("id", loanId)
      .single();

    const { data: payments } = await supabase
      .from("payments")
      .select("*")
      .eq("loan_id", loanId);

    if (!loan) return;

    const totalPayments =
      payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

    const report = [{
      LoanID: loan.id,
      Principal: loan.principal,
      AdminFee: loan.admin_fee,
      TotalPayments: totalPayments,
      CurrentBalance: loan.balance
    }];

    exportCSV(report, `Loan_Report_${loan.id}.csv`);
  }

  function exportPDFView() {
    window.print();
  }

  // ================= DASHBOARD =================

  const totalOutstanding = loans.reduce(
    (sum, l) => sum + (l.balance || 0),
    0
  );

  const projectedInterest = totalOutstanding * 0.05;

  return (
    <div style={wrapperStyle}>
      <div style={{ maxWidth: 1100, width: "100%" }}>
        <h1>Toomaga Payment System</h1>

        <div style={dashboardRow}>
          <DashboardCard title="Total Loans" value={loans.length} />
          <DashboardCard
            title="Total Outstanding"
            value={formatNZD(totalOutstanding)}
          />
          <DashboardCard
            title="Projected 12M Interest"
            value={formatNZD(projectedInterest)}
          />
        </div>

        <div style={cardStyle}>
          <button style={btnStyle} onClick={createLoan}>Create Loan</button>
          <button style={btnStyle} onClick={addPayment}>Add Payment</button>
          <button style={btnStyle} onClick={applyInterest}>Apply 5% Interest</button>
          <button style={btnStyle} onClick={exportFullPortfolio}>Export Full Portfolio (CSV)</button>
          <button style={btnStyle} onClick={generateLoanReport}>Generate Loan Report (CSV)</button>
          <button style={btnStyle} onClick={exportPDFView}>Export PDF</button>
        </div>
      </div>
    </div>
  );
}

// ================= COMPONENTS =================

function DashboardCard({ title, value }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

function formatNZD(amount) {
  return amount.toLocaleString("en-NZ", {
    style: "currency",
    currency: "NZD"
  });
}

// ================= STYLES =================

const wrapperStyle = {
  minHeight: "100vh",
  background: "#f5f7fa",
  padding: 40,
  display: "flex",
  justifyContent: "center",
  fontFamily: "Segoe UI"
};

const loginWrapper = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f7fa"
};

const loginCard = {
  background: "white",
  padding: 40,
  borderRadius: 10,
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  textAlign: "center",
  width: 350
};

const dashboardRow = {
  display: "flex",
  gap: 20,
  marginBottom: 30
};

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  marginBottom: 20,
  flex: 1
};

const btnStyle = {
  marginRight: 10,
  marginBottom: 10,
  padding: "10px 18px",
  borderRadius: 6,
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};
