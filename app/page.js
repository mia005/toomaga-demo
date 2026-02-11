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
    const churchId = prompt("Enter Church ID (copy from list)");
    const amount = Number(prompt("Enter Loan Amount"));

    if (!churchId || !amount) return;

    if (amount > 80000) {
      alert("Loan cannot exceed $80,000");
      return;
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

  const totalOutstanding = loans.reduce((sum, l) => sum + (l.balance || 0), 0);

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Toomaga Payment System – Board Demo</h1>

      <h2>Dashboard</h2>
      <p>Total Loans: {loans.length}</p>
      <p>Total Outstanding: ${totalOutstanding}</p>

      <hr />

      <button onClick={addChurch}>+ Add Church</button>
      <button onClick={createLoan} style={{ marginLeft: 10 }}>
        + Create Loan
      </button>
          <button onClick={addPayment} style={{ marginLeft: 10 }}>
  + Add Payment
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
            {l.loan_ref} | Principal: ${l.principal} | Balance: ${l.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}
