"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AddPaymentForm({ loanId }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Insert Payment
    await supabase.from("payments").insert({
      loan_id: loanId,
      amount: Number(amount),
      payment_date: new Date().toISOString(),
    });

    // 2️⃣ Get Current Loan
    const { data: loan } = await supabase
      .from("loans")
      .select("*")
      .eq("id", loanId)
      .single();

    const newBalance = Number(loan.balance) - Number(amount);

    // 3️⃣ Update Balance
    await supabase
      .from("loans")
      .update({
        balance: newBalance,
        status: newBalance <= 0 ? "COMPLETED" : loan.status,
      })
      .eq("id", loanId);

    setLoading(false);
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <h3>Add Payment</h3>

      <input
        type="number"
        placeholder="Enter payment amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Add Payment"}
      </button>
    </form>
  );
}
