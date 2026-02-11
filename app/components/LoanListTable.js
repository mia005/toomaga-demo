import { currency } from "../lib/format";

export default function LoanListTable({ loans }) {
  return (
    <div style={container}>
      <h2 style={title}>Loan Applications</h2>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Loan Ref</th>
            <th style={th}>Church</th>
            <th style={th}>Principal</th>
            <th style={th}>Balance</th>
            <th style={th}>Interest Rate</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} style={row}>
              <td style={td}>{loan.loan_ref}</td>
              <td style={td}>{loan.church_name}</td>
              <td style={td}>{currency(loan.principal)}</td>
              <td style={td}>{currency(loan.balance)}</td>
              <td style={td}>{loan.interest_rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  marginTop: "30px",
};

const title = {
  marginBottom: "20px",
  fontSize: "20px",
  fontWeight: "600",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "12px 8px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: "14px",
  color: "#555",
};

const td = {
  padding: "12px 8px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: "14px",
};

const row = {
  background: "#fff",
};
import Link from "next/link";

...

<tbody>
  {loans.map((loan) => (
    <tr key={loan.id}>
      <td>
        <Link href={`/loan/${loan.id}`}>
          {loan.loan_ref}
        </Link>
      </td>
      <td>{loan.church_name}</td>
      <td>${loan.principal.toFixed(2)}</td>
      <td>${loan.balance.toFixed(2)}</td>
      <td>{loan.interest_rate}%</td>
    </tr>
  ))}
</tbody>
