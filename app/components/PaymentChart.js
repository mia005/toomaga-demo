"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function PaymentChart({ loanId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const { data: payments } = await supabase
        .from("payments")
        .select("*")
        .eq("loan_id", loanId)
        .order("payment_date", { ascending: true });

      if (!payments) return;

      let running = 0;

      const formatted = payments.map((p) => {
        running += Number(p.amount);

        return {
          date: new Date(p.payment_date).toLocaleDateString(),
          totalPaid: running,
        };
      });

      setData(formatted);
    }

    fetchData();
  }, [loanId]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalPaid"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
