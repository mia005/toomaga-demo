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

  // ---------------- LOGIN ----------------

  function handleLogin() {
    const email = prompt("Enter Email");
    const password = prompt("Enter Password");

    if (email === "admin@toomaga.nz" && password === "demo123") {
      setLoggedIn(true);
    } else {
      alert("Invalid credentials (Demo Login: admin@toomaga.nz / demo123)");
    }
  }

  if (!loggedIn) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        fontFamily: "Segoe UI"
      }}>
        <div style={{
          background: "white",
          padding: 40,
          borderRadius: 10,
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          textAlign: "center",
          width: 350
        }}>
          <h2 style={{ marginBottom: 20 }}>Toomaga Payment System</h2>
          <p style={{ marginBottom: 20 }}>Admin Login</p>
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Login
          </button>
          <p style={{ marginTop: 20, fontSize: 12, color: "#777" }}>
            Demo: admin@toomaga.nz / demo123
          </p>
        </div>
      </div>
    );
  }

  // ---------------- ACTIONS ----------------

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

  const totalOutstanding = loans.reduce(
    (sum, l) => sum + (l.balance || 0),
    0
  );

  const projectedInterest = totalOutstanding * 0.05;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fa",
      padding: "40px",
      display: "flex",
      justifyContent: "center",
      fontFamily: "Segoe UI"
    }}>
      <div style={{ width: "100%", maxWidth: 1100 }}>

        <h1 style={{ marginBottom: 30 }}>Toomaga Payment System</h1>

        <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
          <DashboardCard title="Total Loans" value={loans.length} />
          <DashboardCard
            title="Total Outstanding"
            value={totalOutstanding.toLocaleString("en-NZ", {
              style: "currency",
              currency: "NZD"
            })}
          />
          <DashboardCard
            title="Projected 12M Interest"
            value={projectedInterest.toLocaleString("en-NZ", {
              style: "currency",
              currency: "NZD"
            })}
          />
        </div>

        <div style={cardStyle}>
          <button style={btnStyle} onClick={createLoan}>Create Loan</button>
          <button style={btnStyle} onClick={addPayment}>Add Payment</button>
          <button style={btnStyle} onClick={applyInterest}>Apply 5% Interest</button>
        </div>

      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div style={{
      flex: 1,
      background: "white",
      padding: 25,
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: 26, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

const btnStyle = {
  marginRight: 10,
  padding: "10px 18px",
  borderRadius: 6,
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const cardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  marginBottom: 30,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};
