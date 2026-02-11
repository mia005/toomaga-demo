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
    <div style={wrapper}>
      <h3>Loan Summary by Church</h3>
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
    </div>
  );
}

const wrapper = {
  marginBottom: "40px",
  padding: "20px",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};
