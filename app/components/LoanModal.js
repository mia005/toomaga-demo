"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoanModal({
  churches,
  selectedChurch,
  setSelectedChurch,
  onClose,
  onLoanCreated,
}) {
  const [amount, setAmount] = useState("");

  const generateLoanRef = () => {
    const timestamp = Date.now();
    return `TMS-${timestamp}`;
  };

  const handleSubmit = async () => {
    if (!selectedChurch || !amount) {
      alert("Please select church and enter amount");
      return;
    }

    const loanRef = generateLoanRef();

    const { error } = await supabase.from("loans").insert([
      {
        loan_ref: loanRef,
        church_id: selectedChurch,
        principal: Number(amount),
        balance: Number(amount) + 12, // principal + admin fee
        admin_fee: 12,
        interest_rate: 5,
        interest_applied: false,
      },
    ]);

    if (error) {
      alert("Error creating loan");
      console.log(error);
      return;
    }

    onLoanCreated();
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Create Loan</h2>

        <select
          value={selectedChurch}
          onChange={(e) => setSelectedChurch(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Church</option>
          {churches.map((church) => (
            <option key={church.id} value={church.id}>
              {church.church_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Loan Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button style={primaryBtn} onClick={handleSubmit}>
            Create
          </button>

          <button style={secondaryBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const primaryBtn = {
  background: "#2563eb",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const secondaryBtn = {
  background: "#eee",
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
