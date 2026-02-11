import { currency } from "../lib/format";

export default function LoanListTable({ loans, churches, onSelect }) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>Loan Ref</th>
          <th>Church</th>
          <th>Principal</th>
          <th>Balance</th>
          <th>Interest</th>
        </tr>
      </thead>
      <tbody>
        {loans.map((loan) => {
          const church = churches.find(
            (c) => c.id === loan.church_id
          );

          return (
            <tr key={loan.id} onClick={() => onSelect(loan)}>
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
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "40px",
};
