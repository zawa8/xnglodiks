"use client";
import { useState } from "react";
export default function Search({ rows }) {
  const [q, setQ] = useState("");
  const s = q.trim().toLowerCase();
  const list = s ? rows.filter(r => Object.values(r).some(v => v.toLowerCase().includes(s))) : rows;
  return (
    <>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="search e26 / e23 / xh38" style={{ width: "100%", padding: 8, marginBottom: 12 }} />
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead><tr><th>e26</th><th>e23</th><th>xh38</th></tr></thead>
        <tbody>{list.map(r => (<tr key={r.e26}><td>{r.e26}</td><td>{r.e23}</td><td>{r.xh38}</td></tr>))}</tbody>
      </table>
    </>
  );
}
