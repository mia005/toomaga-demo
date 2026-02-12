"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function CreateLoan() {
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [churchId, setChurchId] = useState("");
  const [principal, setPrincipal] = useState("");

  async function handleCreateLoan() {
    if (!churchId || !principal) {
      alert("Please fill all fields");
      return;
    }

    const initialInterest = Number(principal) * 0.05;
    const approvedAmount = Number(principal) + initialInterest;

    const { error } = await supabase.from("loans").insert([
      {
        loan_ref: `TMS-${Date.now()}`,
        church_id: churchId,
        principal: Number(principal),
        balance: approvedAmount,
        interest_rate: 5,
        admin_fee: 12,
        start_date: new Date().toISOString(),
        interest_applied: true,
        last_interest_date: new Date().toISOString(),
        status: "ACTIVE",
      },
    ]);

    if (error) {
      console.log(error);
      alert("Error creating loan");
      return;
    }

    alert("Loan Created Successfully");
    router.push("/");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 30 }}>Create Loan</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Church ID</label>
        <input
          type="text"
          value={churchId}
          onChange={(e) => setChurchId(e.target.value)}
          style={{ display: "block", padding: 10, width: 300 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Principal Amount</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          style={{ display: "block", padding: 10, width: 300 }}
        />
      </div>

      <button
        onClick={handleCreateLoan}
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Create Loan
      </button>
    </div>
  );
}
