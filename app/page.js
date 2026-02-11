"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [churches, setChurches] = useState([]);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedChurch, setSelectedChurch] = useState("");

  useEffect(() => {
    if (loggedIn) fetchData();
  }, [loggedIn]);

  async function fetchData() {
    const { data: churchesData } = await supabase
      .from("churches")
      .select("*");

    const { data: loansData } = await supabase
      .from("loans")
      .select("*");

    const { data: paymentsData } = await supabase
      .from("payments")
      .select("*");

    setChurches(churchesData || []);
    setLoans(loansData || []);
    setPayments(paymentsData || []);
  }

  // ------------------ FUNCTIONS ------------------

  async function createLoan() {
    if (!selectedChurch) {
      alert("Please select a church");
      return;
    }

    const amount = Number(prompt("Enter Loan Amount"));
    if (!amount) return;

    if (amount > 80000) {
      alert("Loan cannot exceed $80,000");
      return;
    }

    const openingBalance = amount + 120;

    await supabase.from("loans").insert([
      {
        church_id: selectedChurch,
        principal: amount,
        admin_fee: 120,
        balance: openingBalance,
        interest_rate: 5,
        interest_applied: false,
        loan_ref: "TMS-" + Date.now(),
        start_date: new Date()
      }
    ]);

    fetchData();
  }

  async function addPayment() {
    if (!selectedChurch) {
      alert("Please select a church");
      return;
    }

    const churchLoans = loans.filter(
      (loan) => loan.church_id === selectedChurch
    );

    if (!churchLoans.length) {
      alert("No loan found for this church.");
      return;
    }

    const loan = churchLoans[0];

    const amount = Number(prompt("Enter Payment Amount"));
    if (!amount) return;

    const newBalance = loan.balance - amount;

    await supabase.from("payments").insert([
      {
        loan_id: loan.id,
        amount,
        payment_date: new Date()
      }
    ]);

    await supabase
      .from("loans")
      .update({ balance: newBalance })
      .eq("id", loan.id);

    fetchData();
  }

  async function applyInterest() {
    for (const loan of loans) {
      if (!loan.interest_applied) {
        const interest = loan.balance * 0.05;
        const newBalance = loan.balance + interest;

        await supabase
          .from("loans")
          .update({
            balance: newBalance,
            interest_applied: true
          })
          .eq("id", loan.id);
      }
    }

    fetchData();
  }

  function exportCSV() {
    let csv = "Loan Ref,Church,Principal,Balance\n";

    loans.forEach((loan) => {
      const church = churches.find((c) => c.id === loan.church_id);
      csv += `${loan.loan_ref},${church?.church_name},${loan.principal},${loan.balance}\n`;
    });

    downloadFile(csv, "portfolio.csv", "text/csv");
  }

  function exportLoanReport() {
    if (!selectedChurch) {
      alert("Select a church first");
      return;
    }

    const churchLoans = loans.filter(
      (loan) => loan.church_id === selectedChurch
    );

    let csv = "Loan Ref,Principal,Balance\n";

    churchLoans.forEach((loan) => {
      csv += `${loan.loan_ref},${loan.principal},${loan.balance}\n`;
    });

    downloadFile(csv, "loan_report.csv", "text/csv");
  }

  function exportPDF() {
    let content = "Toomaga Loan Report\n\n";

    loans.forEach((loan) => {
      const church = churches.find((c) => c.id === loan.church_id);
      content += `Loan: ${loan.loan_ref}\n`;
      content += `Church: ${church?.church_name}\n`;
      content += `Balance: $${loan.balance}\n\n`;
    });

    downloadFile(content, "report.pdf", "application/pdf");
  }

  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  const totalOutstanding = loans.reduce(
    (sum, loan) => sum + (loan.balance || 0),
    0
  );

  const projectedInterest = totalOutstanding * 0.05;

  // ------------------ LOGIN ------------------

  if (!loggedIn) {
    return (
      <div style={centerStyle}>
        <div style={cardStyle}>
          <h2>Toomaga Payment System</h2>
          <button
            style={buttonStyle}
            onClick={() => setLoggedIn(true)}
          >
            Login (Demo)
          </button>
        </div>
      </div>
    );
  }

  // ------------------ DASHBOARD ------------------

  return (
    <div style={centerStyle}>
      <div style={{ width: "100%", maxWidth: 1100 }}>
        <h1 style={{ textAlign: "center" }}>
          Toomaga Payment System
        </h1>

        <div style={statsContainer}>
          <StatCard title="Total Loans" value={loans.length} />
          <StatCard
            title="Total Outstanding"
            value={formatCurrency(totalOutstanding)}
          />
          <StatCard
            title="Projected 12M Interest"
            value={formatCurrency(projectedInterest)}
          />
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600 }}>
              Select Church:
            </label>

            <select
              value={selectedChurch}
              onChange={(e) => setSelectedChurch(e.target.value)}
              style={selectStyle}
            >
              <option value="">-- Choose Church --</option>
              {churches.map((church) => (
                <option key={church.id} value={church.id}>
                  {church.church_name}
                </option>
              ))}
            </select>
          </div>

          <div style={buttonRow}>
            <button style={buttonStyle} onClick={createLoan}>
              Create Loan
            </button>
            <button style={buttonStyle} onClick={addPayment}>
              Add Payment
            </button>
            <button style={buttonStyle} onClick={applyInterest}>
              Apply 5% Interest
            </button>
            <button style={buttonStyle} onClick={exportCSV}>
              Export Portfolio CSV
            </button>
            <button style={buttonStyle} onClick={exportLoanReport}>
              Loan Report CSV
            </button>
            <button style={buttonStyle} onClick={exportPDF}>
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------ COMPONENTS ------------------

function StatCard({ title, value }) {
  return (
    <div style={statCardStyle}>
      <h3>{title}</h3>
      <p style={{ fontSize: 22, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

// ------------------ HELPERS ------------------

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD"
  }).format(value || 0);
}

// ------------------ STYLES ------------------

const centerStyle = {
  minHeight: "100vh",
  background: "#f5f7fa",
  display: "flex",
  justifyContent: "center",
  padding: 40
};

const cardStyle = {
  background: "white",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  marginBottom: 30
};

const statCardStyle = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  flex: 1
};

const statsContainer = {
  display: "flex",
  gap: 20,
  marginBottom: 30
};

const buttonRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10
};

const buttonStyle = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const selectStyle = {
  display: "block",
  marginTop: 10,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  minWidth: 250
};
