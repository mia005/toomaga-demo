"use client";

export default function ActionBar({
  churches,
  selectedChurch,
  setSelectedChurch,
  onCreateLoan,
}) {
  return (
    <div
      style={{
        margin: "30px 0",
        padding: "20px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <select
        value={selectedChurch}
        onChange={(e) => setSelectedChurch(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          minWidth: "220px",
        }}
      >
        <option value="">Select Church</option>
        {churches.map((church) => (
          <option key={church.id} value={church.id}>
            {church.church_name}
          </option>
        ))}
      </select>

      <button
        onClick={onCreateLoan}
        style={{
          background: "#2563eb",
          color: "white",
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        + Create Loan
      </button>
    </div>
  );
}
