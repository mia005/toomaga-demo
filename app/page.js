import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // ==============================
  // FETCH LOANS
  // ==============================
  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .order("created_at", { ascending: false });

  const totalLoans = loans?.length || 0;

  const totalOutstanding =
    loans?.reduce((sum, loan) => sum + Number(loan.balance || 0), 0) || 0;

  const projectedInterest =
    loans?.reduce(
      (sum, loan) =>
        sum + Number(loan.balance || 0) * (Number(loan.interest_rate || 0) / 100),
      0
    ) || 0;

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 30,
          color: "#1e293b",
        }}
      >
        Toomaga Payment System
      </h1>

      {/* ============================== */}
      {/* DASHBOARD CARDS */}
      {/* ============================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <DashboardCard title="Total Loans" value={totalLoans} />
        <DashboardCard
          title="Total Outstanding"
          value={`$${totalOutstanding.toLocaleString()}`}
        />
        <DashboardCard
          title="Projected 12M Interest"
          value={`$${projectedInterest.toLocaleString()}`}
        />
      </div>

      {/* ============================== */}
      {/* LOAN TABLE */}
      {/* ============================== */}
      <div
        style={{
          background: "#ffffff",
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 25,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>
            Loan Applications
          </h2>

          <Link href="/create-loan">
            <button
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              + Create Loan
            </button>
          </Link>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              <th style={{ padding: 12 }}>Loan Ref</th>
              <th style={{ padding: 12 }}>Principal</th>
              <th style={{ padding: 12 }}>Balance</th>
              <th style={{ padding: 12 }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {loans?.map((loan) => (
              <tr
                key={loan.id}
                style={{
                  borderBottom: "1px solid #f1f5f9",
                  transition: "background 0.2s",
                }}
              >
                <td style={{ padding: 12 }}>
                  <Link
                    href={`/loans/${loan.id}`}
                    style={{
                      color: "#2563eb",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {loan.loan_ref}
                  </Link>
                </td>

                <td style={{ padding: 12 }}>
                  ${Number(loan.principal).toLocaleString()}
                </td>

                <td style={{ padding: 12 }}>
                  ${Number(loan.balance).toLocaleString()}
                </td>

                <td style={{ padding: 12 }}>
                  <StatusBadge status={loan.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================== */
/* COMPONENTS */
/* ============================== */

function DashboardCard({ title, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: 25,
        borderRadius: 14,
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
      }}
    >
      <p
        style={{
          fontSize: 14,
          color: "#64748b",
          marginBottom: 10,
        }}
      >
        {title}
      </p>

      <h3
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {value}
      </h3>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    COMPLETED: {
      bg: "#dcfce7",
      text: "#166534",
    },
    ACTIVE: {
      bg: "#dbeafe",
      text: "#1e40af",
    },
    OVERDUE: {
      bg: "#fee2e2",
      text: "#991b1b",
    },
  };

  const style = colors[status] || {
    bg: "#f1f5f9",
    text: "#334155",
  };

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      {status}
    </span>
  );
}
