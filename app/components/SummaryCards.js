import { currency } from "../lib/financeEngine";

export default function SummaryCards({ loans }) {
  const totalLoans = loans.length;

  const totalOutstanding = loans.reduce(
    (sum, loan) => sum + (loan.balance || 0),
    0
  );

  const projectedInterest = loans.reduce(
    (sum, loan) =>
      sum + (loan.balance || 0) * (loan.interest_rate / 100),
    0
  );

  return (
    <div style={grid}>
      <Card title="Total Loans" value={totalLoans} />
      <Card title="Total Outstanding" value={currency(totalOutstanding)} />
      <Card
        title="Projected 12M Interest"
        value={currency(projectedInterest)}
      />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={card}>
      <p style={{ color: "#666" }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const card = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};
