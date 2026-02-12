import { createClient } from "@supabase/supabase-js";
import AddPaymentForm from "../../components/AddPaymentForm";
import PaymentChart from "../../components/PaymentChart";

export const dynamic = "force-dynamic";

export default async function LoanDetail({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { id } = params;

  // ==============================
  // FETCH LOAN
  // ==============================
  const { data: loan } = await supabase
    .from("loans")
    .select("*, churches(church_name)")
    .eq("id", id)
    .single();

  if (!loan) {
    return <div style={{ padding: 40 }}>Loan not found</div>;
  }

  // ==============================
  // FETCH PAYMENTS
  // ==============================
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("loan_id", id)
    .order("payment_date", { ascending: true });

  // ==============================
  // FINANCIAL ENGINE
  // ==============================

  const principal = Number(loan.principal);
  const interestRate = Number(loan.interest_rate || 0);
  const adminFeeRate = 5; // 5% initial admin fee

  // 1️⃣ Initial 5% Admin Fee
  const adminFee = principal * (adminFeeRate / 100);

  // 2️⃣ Loan starts with principal + admin fee
  let calculatedBalance = principal + adminFee;

  // 3️⃣ Apply payments
  const totalPaid =
    payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  calculatedBalance -= totalPaid;

  // 4️⃣ Project 12 month interest (for display)
  const projectedInterest =
    calculatedBalance * (interestRate / 100);

  // 5️⃣ Running Balance for table
  let runningBalance = principal + adminFee;

  const paymentsWithBalance = payments?.map((payment) => {
    runningBalance -= Number(payment.amount);

    return {
      ...payment,
      runningBalance,
    };
  });

  // ==============================
  // AUTO STATUS UPDATE
  // ==============================
  if (calculatedBalance <= 0 && loan.status !== "COMPLETED") {
    await supabase
      .from("loans")
      .update({ status: "COMPLETED" })
      .eq("id", id);
  }

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 25 }}>Loan Detail</h1>

      {/* ========================= */}
      {/* LOAN SUMMARY */}
      {/* ========================= */}
      <div
        style={{
          background: "#ffffff",
          padding: 25,
          borderRadius: 12,
          marginBottom: 30,
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        }}
      >
        <p><strong>Loan Ref:</strong> {loan.loan_ref}</p>
        <p><strong>Church:</strong> {loan.churches?.church_name}</p>
        <p><strong>Principal:</strong> ${principal.toLocaleString()}</p>
        <p><strong>Admin Fee (5%):</strong> ${adminFee.toLocaleString()}</p>
        <p><strong>Total Paid:</strong> ${totalPaid.toLocaleString()}</p>
        <p><strong>Current Balance:</strong> ${calculatedBalance.toLocaleString()}</p>
        <p><strong>Projected 12M Interest:</strong> ${projectedInterest.toLocaleString()}</p>
        <p><strong>Status:</strong> {calculatedBalance <= 0 ? "COMPLETED" : loan.status}</p>
      </div>

      {/* ========================= */}
      {/* ADD PAYMENT */}
      {/* ========================= */}
      <div style={{ marginBottom: 40 }}>
        <AddPaymentForm loanId={loan.id} />
      </div>

      {/* ========================= */}
      {/* CHART */}
      {/* ========================= */}
      <div style={{ marginBottom: 40 }}>
        <h3>Payment Chart</h3>
        <PaymentChart loanId={id} />
      </div>

      {/* ========================= */}
      {/* PAYMENT HISTORY */}
      {/* ========================= */}
      <h2 style={{ marginBottom: 15 }}>Payment History</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#ffffff",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={{ padding: 12 }}>Date</th>
            <th style={{ padding: 12 }}>Amount</th>
            <th style={{ padding: 12 }}>Running Balance</th>
          </tr>
        </thead>

        <tbody>
          {paymentsWithBalance?.map((payment) => (
            <tr key={payment.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 12 }}>
                {new Date(payment.payment_date).toLocaleDateString()}
              </td>
              <td style={{ padding: 12 }}>
                ${Number(payment.amount).toLocaleString()}
              </td>
              <td style={{ padding: 12 }}>
                ${Number(payment.runningBalance).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
