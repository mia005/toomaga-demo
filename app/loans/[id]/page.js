"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { currency } from "../../lib/format";

export default function LoanDetail({ params }) {
  const { id } = params;

  const [loan, setLoan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    fetchLoan();
    fetchPayments();
  }, []);

  const fetchLoan = async () => {
    const { data } = await supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .single();

    setLoan(data);
  };

  const fetchPayments = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("loan_id", id)
      .order("payment_date", { ascending: false });

    if (data) {
      setPayments(data);

      const paid = data.reduce((sum, p) => sum + p.amount, 0);
      setTotalPaid(paid);

      const { data: loanData } = await supabase
        .from("loans")
        .select("balance")
        .eq("id", id)
        .single();

      const remainingBalance = loanData.balance - paid;
      setRemaining(remainingBalance);
    }
  };

  if (!loan) return <div>Loading...</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Loan Detail</h1>

      <div style={card}>
        <p><strong>Loan Ref:</strong> {loan.loan_ref}</p>
        <p><strong>Principal:</strong> {currency(loan.principal)}</p>
        <p><strong>Base Balance:</strong> {currency(loan.balance)}</p>
        <p><strong>Total Paid:</strong> {currency(totalPaid)}</p>
        <p><strong>Remaining:</strong> {currency(remaining)}</p>
        <p><strong>Status:</strong> {loan.status}</p>
      </div>

      <h2 style={{ marginTop: "40px" }}>Payment History</h2>

      <table style={table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.payment_date}</td>
              <td>{currency(p.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};
