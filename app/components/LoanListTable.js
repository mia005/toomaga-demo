import Link from "next/link";

export default function LoanListTable({ loans }) {
  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "20px" }}>Loan Applications</h2>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Loan Ref</th>
            <th>Church</th>
            <th>Principal</th>
            <th>Balance</th>
            <th>Interest Rate</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} style={rowStyle}>
              <td>
                <Link
                  href={`/loans/${loan.id}`}
                  style={{ color: "#2f5bea", fontWeight: "600" }}
                >
                  {loan.loan_ref}
                </Link>
              </td>

              <td>{loan.churches?.church_name}</td>
              <td>${Number(loan.principal).toFixed(2)}</td>
              <td>${Number(loan.balance).toFixed(2)}</td>
              <td>{loan.interest_rate}%</td>
              <td>{loan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const containerStyle = {
  background: "#ffffff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  marginTop: "40px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const rowStyle = {
  borderBottom: "1px solid #eee"
};
