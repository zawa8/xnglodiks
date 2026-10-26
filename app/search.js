"use client";
import { useMemo, useState } from "react";

const LIMIT = 300;
const COLS = ["xh38", "e23", "e26"];
const EXAMPLES = ["^k", "n$", "^.{4}$", "[IUEK]", "(a)\\1", "^[^aeiouxIUE]+$"];

export default function Search({ rows }) {
  const [pattern, setPattern] = useState("");
  const [col, setCol] = useState("xh38");
  const [whole, setWhole] = useState(false);
  const [caseSens, setCaseSens] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const { list, error } = useMemo(() => {
    if (!pattern) return { list: rows, error: "" };
    try {
      const src = whole ? `^(?:${pattern})$` : pattern;
      const re = new RegExp(src, caseSens ? "" : "i");
      return { list: rows.filter(r => re.test(r[col])), error: "" };
    } catch (e) {
      return { list: [], error: e.message };
    }
  }, [pattern, col, whole, caseSens, rows]);

  const shown = showAll ? list : list.slice(0, LIMIT);
  const box = { padding: 8, border: "1px solid #888", borderRadius: 6 };

  return (
    <>
      <input
        value={pattern}
        onChange={e => { setPattern(e.target.value); setShowAll(false); }}
        placeholder="regex, zaise ^k.*n$"
        autoCapitalize="off" autoCorrect="off" spellCheck={false}
        style={{ ...box, width: "100%", fontFamily: "monospace", fontSize: "1rem", boxSizing: "border-box" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", margin: "10px 0" }}>
        <label>column:{" "}
          <select value={col} onChange={e => setCol(e.target.value)} style={box}>
            {COLS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label><input type="checkbox" checked={whole} onChange={e => setWhole(e.target.checked)} /> pura shabd match</label>
        <label><input type="checkbox" checked={caseSens} onChange={e => setCaseSens(e.target.checked)} /> case sensitive</label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {EXAMPLES.map(x => (
          <button key={x} onClick={() => { setPattern(x); setShowAll(false); }} style={{ ...box, padding: "2px 8px", fontFamily: "monospace", cursor: "pointer", background: "transparent", color: "inherit" }}>{x}</button>
        ))}
      </div>

      {error ? (
        <p style={{ color: "#d33" }}>regex galat vai: {error}</p>
      ) : (
        <p>{list.length} shabd mile{list.length > shown.length ? ` (pehle ${shown.length} dikha rahe vain)` : ""}</p>
      )}

      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", minWidth: 320 }}>
          <thead><tr><th>e26</th><th>e23</th><th>xh38</th></tr></thead>
          <tbody>
            {shown.map(r => (
              <tr key={r.e26}>
                <td>{r.e26}</td>
                <td>{r.e23}</td>
                <td style={{ fontFamily: "var(--xh38ascfont), system-ui, sans-serif", fontSize: "1.25rem" }}>{r.xh38}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {list.length > shown.length && (
        <button onClick={() => setShowAll(true)} style={{ ...box, marginTop: 12, cursor: "pointer" }}>sab {list.length} dikhao</button>
      )}
    </>
  );
}
