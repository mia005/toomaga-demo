import { createClient } from "@supabase/supabase-js";
import AddPaymentForm from "../../components/AddPaymentForm";

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
  // CALCULATIONS
  // ==============================
  const totalPaid =
    payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Running balance starting from principal
  let runningBalance = Number(loan.principal);

  const paymentsWithBalance = payments?.map((payment) => {
    runningBalance -= Number(payment.amount);

    return {
      ...payment,
      runningBalance,
    };
  });

  // ==============================
  // AUTO MARK COMPLETED
  // ==============================
  if (loan.balance <= 0 && loan.status !== "COMPLETED") {
    await supabase
      .from("loans")
      .update({ status: "COMPLETED" })
      .eq("id", id);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 20 }}>Loan Detail</h1>

      {/* ========================= */}
      {/* Loan Summary */}
      {/* ========================= */}
      <div style={{ marginBottom: 30 }}>
        <p><strong>Loan Ref:</strong> {loan.loan_ref}</p>
        <p><strong>Church:</strong> {loan.churches?.church_name}</p>
        <p><strong>Principal:</strong> ${Number(loan.principal).toFixed(2)}</p>
        <p><strong>Current Balance:</strong> ${Number(loan.balance).toFixed(2)}</p>
        <p><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</p>
        <p><strong>Status:</strong> {loan.status}</p>
      </div>

      {/* ========================= */}
      {/* Add Payment Form */}
      {/* ========================= */}
      <div style={{ marginBottom: 40 }}>
        <AddPaymentForm loanId={loan.id} />
      </div>

      {/* ========================= */}
      {/* Payment History */}
      {/* ========================= */}
      <h2 style={{ marginBottom: 15 }}>Payment History</h2>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 10
      }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: 10 }}>Date</th>
            <th style={{ padding: 10 }}>Amount</th>
            <th style={{ padding: 10 }}>Running Balance</th>
          </tr>
        </thead>

        <tbody>
          {paymentsWithBalance?.map((payment) => (
            <tr key={payment.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 10 }}>
                {new Date(payment.payment_date).toLocaleDateString()}
              </td>
              <td style={{ padding: 10 }}>
                ${Number(payment.amount).toFixed(2)}
              </td>
              <td style={{ padding: 10 }}>
                ${Number(payment.runningBalance).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
