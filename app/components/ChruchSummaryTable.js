import { currency } from "../lib/format";

export default function ChurchSummaryTable({ loans, churches }) {
  const summary = churches.map((church) => {
    const churchLoans = loans.filter(
      (l) => l.church_id === church.id
    );

    const totalOutstanding = churchLoans.reduce(
      (sum, l) => sum + (l.balance || 0),
      0
    );

    return {
      church_name: church.church_name,
      totalLoans: churchLoans.length,
      totalOutstanding,
    };
  });

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>Church</th>
          <th>Total Loans</th>
          <th>Total Outstanding</th>
        </tr>
      </thead>
      <tbody>
        {summary.map((row, index) => (
          <tr key={index}>
            <td>{row.church_name}</td>
            <td>{row.totalLoans}</td>
            <td>{currency(row.totalOutstanding)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "30px",
};
