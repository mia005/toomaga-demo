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

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      alert("Enter valid payment amount");
      setLoading(false);
      return;
    }

    // Insert payment
    const { error } = await supabase.from("payments").insert([
      {
        loan_id: loanId,
        amount: paymentAmount,
        payment_date: new Date(),
      },
    ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Payment added successfully");
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <h3>Add Payment</h3>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "8px 16px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Add Payment"}
      </button>
    </form>
  );
}
