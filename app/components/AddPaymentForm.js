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

    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      setLoading(false);
      return;
    }

    // Insert payment
    const { error } = await supabase.from("payments").insert([
      {
        loan_id: loanId,
        amount: Number(amount),
        payment_date: new Date(),
      },
    ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Reduce loan balance
    const { data: loan } = await supabase
      .from("loans")
      .select("balance")
      .eq("id", loanId)
      .single();

    const newBalance = Number(loan.balance) - Number(amount);

    await supabase
      .from("loans")
      .update({ balance: newBalance })
      .eq("id", loanId);

    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <h3>Add Payment</h3>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: 10,
          marginRight: 10,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 16px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Add Payment"}
      </button>
    </form>
  );
}
