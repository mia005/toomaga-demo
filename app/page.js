"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [churches, setChurches] = useState([]);

  useEffect(() => {
    fetchChurches();
  }, []);

  async function fetchChurches() {
    const { data } = await supabase.from("churches").select("*");
    setChurches(data || []);
  }

  async function addChurch() {
    const name = prompt("Enter Church Name");
    if (!name) return;
    await supabase.from("churches").insert([{ church_name: name }]);
    fetchChurches();
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Toomaga Payment System – Live Demo</h1>

      <button onClick={addChurch}>+ Add Church</button>

      <h2>Church List</h2>
      <ul>
        {churches.map((c) => (
          <li key={c.id}>{c.church_name}</li>
        ))}
      </ul>
    </div>
  );
}
