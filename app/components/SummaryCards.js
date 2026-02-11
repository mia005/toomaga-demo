import { currency } from "../lib/format";
import {
  calculateTotalOutstanding,
  calculateProjectedInterest,
} from "../lib/calculations";

export default function SummaryCards({ loans }) {
  const totalLoans = loans.length;
  const totalOutstanding = calculateTotalOutstanding(loans);
  const projectedInterest = calculateProjectedInterest(loans);

  return (
    <div style={gridStyle}>
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
    <div style={cardStyle}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginBottom: "40px",
};

const cardStyle = {
  padding: "20px",
  borderRadius: "12px",
  background: "white",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};
