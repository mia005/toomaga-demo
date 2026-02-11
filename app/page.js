import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const dynamic = "force-dynamic"; // prevents static build errors

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .order("created_at", { ascending: false });

  const totalLoans = loans?.length || 0;
  const totalOutstanding =
    loans?.reduce((sum, l) => sum + Number(l.balance), 0) || 0;

  const projectedInterest =
    loans?.reduce((sum, l) => sum + (l.balance * 0.05), 0) || 0;

  return (
    <div className="container">
      <h1>Toomaga Payment System</h1>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Loans</h3>
          <p>{totalLoans}</p>
        </div>

        <div className="card">
          <h3>Total Outstanding</h3>
          <p>${totalOutstanding.toLocaleString()}</p>
        </div>

        <div className="card">
          <h3>Projected 12M Interest</h3>
          <p>${projectedInterest.toLocaleString()}</p>
        </div>
      </div>

      <div className="loan-header">
        <h2>Loan Applications</h2>
        <Link href="/create">
          <button className="primary-btn">+ Create Loan</button>
        </Link>
      </div>

      <table className="loan-table">
        <thead>
          <tr>
            <th>Loan Ref</th>
            <th>Principal</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans?.map((loan) => (
            <tr key={loan.id}>
              <td>
                <Link href={`/loans/${loan.id}`}>
                  {loan.loan_ref}
                </Link>
              </td>
              <td>${loan.principal.toLocaleString()}</td>
              <td>${loan.balance.toLocaleString()}</td>
              <td>{loan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
