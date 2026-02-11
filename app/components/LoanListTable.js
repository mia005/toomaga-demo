import { currency } from "../lib/format";

export default function LoanListTable({ loans, churches }) {
  return (
    <div style={wrapper}>
      <h3>Loan Applications</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Loan Ref</th>
            <th>Church</th>
            <th>Principal</th>
            <th>Balance</th>
            <th>Interest Rate</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => {
            const church = churches.find(
              (c) => c.id === loan.church_id
            );

            return (
              <tr key={loan.id}>
                <td>{loan.loan_ref}</td>
                <td>{church?.church_name}</td>
                <td>{currency(loan.principal)}</td>
                <td>{currency(loan.balance)}</td>
                <td>{loan.interest_rate}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const wrapper = {
  padding: "20px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};
