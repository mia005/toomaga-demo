"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [churches, setChurches] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: churchesData } = await supabase.from("churches").select("*");
    const { data: loansData } = await supabase.from("loans").select("*");

    setChurches(churchesData || []);
    setLoans(loansData || []);
  }

  async function addChurch() {
    const name = prompt("Enter Church Name");
    if (!name) return;

    await supabase.from("churches").insert([{ church_name: name }]);
    fetchData();
  }

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

    if (!loan) {
      alert("Loan not found");
      return;
    }

    const newBalance = loan.balance - amount;

    await supabase.from("payments").insert([
      {
        loan_id: loanId,
        amount: amount,
        payment_date: new Date()
      }
    ]);

    await supabase
      .from("loans")
      .update({ balance: newBalance })
      .eq("id", loanId);

    fetchData();
  }

  async function applyInterest() {
    const loanId = prompt("Enter Loan ID to apply 5% interest");

    if (!loanId) return;

    const { data: loan } = await supabase
      .from("loans")
      .select("*")
      .eq("id", loanId)
      .single();

    if (!loan) {
      alert("Loan not found");
      return;
    }

    const interestAmount = loan.balance * 0.05;
    const newBalance = loan.balance + interestAmount;

    await supabase
      .from("loans")
      .update({ balance: newBalance })
      .eq("id", loanId);

    alert("5% interest applied successfully");
    fetchData();
  }

  const totalOutstanding = loans.reduce(
    (sum, l) => sum + (l.balance || 0),
    0
  );

  return (return (
  <div style={{
    minHeight: "100vh",
    background: "#f5f7fa",
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif"
  }}>

    <h1 style={{
      marginBottom: 30,
      fontWeight: 600
    }}>
      Toomaga Payment System
    </h1>

    {/* DASHBOARD */}
    <div style={{
      display: "flex",
      gap: 20,
      marginBottom: 40
    }}>
      <div style={{
        flex: 1,
        background: "white",
        padding: 25,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <h3>Total Loans</h3>
        <p style={{ fontSize: 28, fontWeight: "bold" }}>
          {loans.length}
        </p>
      </div>

      <div style={{
        flex: 1,
        background: "white",
        padding: 25,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        <h3>Total Outstanding</h3>
        <p style={{ fontSize: 28, fontWeight: "bold" }}>
          {totalOutstanding.toLocaleString("en-NZ", {
            style: "currency",
            currency: "NZD"
          })}
        </p>
      </div>
    </div>

    {/* ACTIONS */}
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 10,
      marginBottom: 40,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{ marginBottom: 15 }}>Actions</h3>

      <button style={btnStyle} onClick={addChurch}>Add Church</button>
      <button style={btnStyle} onClick={createLoan}>Create Loan</button>
      <button style={btnStyle} onClick={addPayment}>Add Payment</button>
      <button style={btnStyle} onClick={applyInterest}>Apply 5% Interest</button>
      <button style={btnStyle} onClick={addTopUp}>Add Top-Up</button>
    </div>

    {/* CHURCH LIST */}
    <div style={cardStyle}>
      <h3>Churches</h3>
      <ul>
        {churches.map((c) => (
          <li key={c.id}>{c.church_name}</li>
        ))}
      </ul>
    </div>

    {/* LOANS */}
    <div style={cardStyle}>
      <h3>Loans</h3>
      <ul>
        {loans.map((l) => (
          <li key={l.id}>
            Principal: {Number(l.principal).toLocaleString("en-NZ", {
              style: "currency",
              currency: "NZD"
            })} |
            Balance: {Number(l.balance).toLocaleString("en-NZ", {
              style: "currency",
              currency: "NZD"
            })}
          </li>
        ))}
      </ul>
    </div>

  </div>
);

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



      <hr />

      <button onClick={addChurch}>+ Add Church</button>
      <button onClick={createLoan} style={{ marginLeft: 10 }}>
        + Create Loan
      </button>
      <button onClick={addPayment} style={{ marginLeft: 10 }}>
        + Add Payment
      </button>
      <button onClick={applyInterest} style={{ marginLeft: 10 }}>
        + Apply 5% Interest
      </button>

      <h2>Church List</h2>
      <ul>
        {churches.map((c) => (
          <li key={c.id}>
            {c.church_name} – ID: {c.id}
          </li>
        ))}
      </ul>

      <h2>Loans</h2>
      <ul>
        {loans.map((l) => (
          <li key={l.id}>
            Loan ID: {l.id} |
Principal: {Number(l.principal).toLocaleString("en-NZ", { style: "currency", currency: "NZD" })} |
Balance: {Number(l.balance).toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}

          </li>
        ))}
      </ul>
    </div>
  );
}
