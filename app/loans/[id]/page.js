import { createClient } from "@supabase/supabase-js";
import AddPaymentForm from "../../components/AddPaymentForm";


export const dynamic = "force-dynamic";

export default async function LoanDetail({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { id } = params;

  // Fetch loan
  const { data: loan } = await supabase
    .from("loans")
    .select("*, churches(church_name)")
    .eq("id", id)
    .single();

  // Fetch payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("loan_id", id)
    .order("payment_date", { ascending: true });

  if (!loan) {
    return <div style={{ padding: "40px" }}>Loan not found</div>;
  }

  // Running balance logic
  let runningBalance = Number(loan.principal);

  const paymentsWithBalance = payments?.map((payment) => {
    runningBalance -= Number(payment.amount);

    return {
      ...payment,
      runningBalance,
    };
  });

  const totalPaid =
    payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
let runningBalance = Number(loan.principal);

const paymentsWithBalance = payments?.map((payment) => {
  runningBalance -= Number(payment.amount);

  return {
    ...payment,
    runningBalance,
  };
});

  return (
    <div style={{ padding: "40px" }}>
      <h1>Loan Detail</h1>

      <div style={{ marginBottom: "30px" }}>
        <p><strong>Loan Ref:</strong> {loan.loan_ref}</p>
        <p><strong>Church:</strong> {loan.churches?.church_name}</p>
        <p><strong>Principal:</strong> ${Number(loan.principal).toFixed(2)}</p>
        <p><strong>Current Balance:</strong> ${Number(loan.balance).toFixed(2)}</p>
        <p><strong>Total Paid:</strong> ${totalPaid.toFixed(2)}</p>
        <p><strong>Status:</strong> {loan.status}</p>
      </div>

      {/* Add Payment Form */}
      <AddPaymentForm loanId={loan.id} />

      <h2 style={{ marginTop: "40px" }}>Payment History</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>Date</th>
            <th>Amount</th>
            <th>Remaining After Payment</th>
          </tr>
        </thead>
        <tbody>
  {paymentsWithBalance?.map((p) => (
    <tr key={p.id}>
      <td>{new Date(p.payment_date).toLocaleDateString()}</td>
      <td>${Number(p.amount).toFixed(2)}</td>
      <td>${Number(p.runningBalance).toFixed(2)}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
