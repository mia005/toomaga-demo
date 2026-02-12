"use client";

import { useState } from "react";

export default function ActionBar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={bar}>
      <button style={button} onClick={() => setShowModal(true)}>
        + Create Loan
      </button>

      {showModal && <div>Modal Coming Next</div>}
    </div>
  );
}

const bar = {
  marginBottom: "20px",
};

const button = {
  background: "#2563eb",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};
