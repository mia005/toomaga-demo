"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import SummaryCards from "./components/SummaryCards";
import LoanListTable from "./components/LoanListTable";
import ActionBar from "./components/ActionBar";
import LoanModal from "./components/LoanModal";

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [churches, setChurches] = useState([]);
  const [selectedChurch, setSelectedChurch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchChurches = async () => {
    const { data } = await supabase.from("churches").select("*");
    if (data) setChurches(data);
  };

  const fetchLoans = async () => {
    const { data } = await supabase
      .from("loans")
      .select("*, churches(church_name)");

    if (data) {
      const formatted = data.map((loan) => ({
        ...loan,
        church_name: loan.churches?.church_name,
      }));
      setLoans(formatted);
    }
  };

  useEffect(() => {
    fetchChurches();
    fetchLoans();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>
        <h1 style={{ marginBottom: "30px" }}>
          Toomaga Payment System
        </h1>

        <SummaryCards loans={loans} />

        <ActionBar
          churches={churches}
          selectedChurch={selectedChurch}
          setSelectedChurch={setSelectedChurch}
          onCreateLoan={() => setShowModal(true)}
        />

        <LoanListTable loans={loans} />

        {showModal && (
          <LoanModal
            churches={churches}
            selectedChurch={selectedChurch}
            setSelectedChurch={setSelectedChurch}
            onClose={() => setShowModal(false)}
            onLoanCreated={fetchLoans}
          />
        )}
      </div>
    </div>
  );
}
