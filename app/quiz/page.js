"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

const XH = { fontFamily: "var(--xh38ascfont), system-ui, sans-serif" };
const box = { padding: "10px 14px", border: "1px solid #888", borderRadius: 8, fontSize: "1rem", background: "transparent", color: "inherit", cursor: "pointer", textAlign: "left" };

async function api(path, method = "GET", body) {
  const sb = getSupabase();
  const { data } = await sb.auth.getSession();
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `error ${res.status}`);
  return json;
}

export default function QuizPage() {
  const [phase, setPhase] = useState("loading"); // loading | nosb | noauth | none | run | done
  const [uid, setUid] = useState(null);
  const [qs, setQs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [i, setI] = useState(0);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const apply = useCallback((s, id) => {
    if (s.state === "done") { setResult(s); setPhase("done"); return; }
    if (s.state === "inprogress") {
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem(`xq:${id}`)); } catch {}
      setQs(s.questions);
      setAnswers(Array.isArray(saved) && saved.length === s.questions.length ? saved : Array(s.questions.length).fill(null));
      setI(0); setPhase("run"); return;
    }
    setPhase("none");
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setPhase("nosb"); return; }
    let alive = true;
    (async () => {
      const { data } = await sb.auth.getSession();
      const u = data.session?.user;
      if (!u) { if (alive) setPhase("noauth"); return; }
      setUid(u.id);
      try { const s = await api("/api/quiz"); if (alive) apply(s, u.id); }
      catch (e) { if (alive) { setErr(e.message); setPhase("none"); } }
    })();
    return () => { alive = false; };
  }, [apply]);

  async function start() {
    setBusy(true); setErr("");
    try { apply(await api("/api/quiz", "POST"), uid); } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  function pick(opt) {
    const next = answers.slice(); next[i] = opt; setAnswers(next);
    try { localStorage.setItem(`xq:${uid}`, JSON.stringify(next)); } catch {}
  }

  async function submit() {
    const left = answers.filter(a => a === null).length;
    if (left && !confirm(`${left} prashn khali vain. phir bhi submit karo? (kuiz sirf ek bar vota vai)`)) return;
    setBusy(true); setErr("");
    try {
      const r = await api("/api/quiz/submit", "POST", { answers });
      try { localStorage.removeItem(`xq:${uid}`); } catch {}
      setResult(r); setPhase("done");
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }

  if (phase === "loading") return <p>...</p>;
  if (phase === "nosb") return <p>supabase config nvi vai. `.env.example` dekho.</p>;
  if (phase === "noauth") return (<main><h1>kuiz</h1><p>kuiz dene ke lie pehle <Link href="/login" style={{ textDecoration: "underline" }}>sain in</Link> karo.</p></main>);

  if (phase === "none") return (
    <main>
      <h1>kuiz</h1>
      <p>64 multiple choice prashn. har prashn me 4 option. kuiz sirf <b>ek bar</b> vota vai or result save vota vai.</p>
      <button onClick={start} disabled={busy} style={{ ...box, fontWeight: 700 }}>kuiz shuru karo</button>
      {err && <p style={{ color: "#d33" }}>{err}</p>}
    </main>
  );

  if (phase === "done") {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <main>
        <h1>kuiz result</h1>
        <p style={{ fontSize: "2rem", margin: "8px 0" }}><b>{result.score}</b> / {result.total} ({pct}%)</p>
        <p style={{ opacity: 0.7 }}>kuiz pura vo gya. result save vai.</p>
      </main>
    );
  }

  const q = qs[i];
  const done = answers.filter(a => a !== null).length;
  const isXh = (t) => t === "e2x"; // e2x options are xh38 spellings
  return (
    <main>
      <p style={{ opacity: 0.7 }}>prashn {i + 1} / {qs.length} · {done} jawab diye</p>
      <div style={{ height: 6, background: "#8884", borderRadius: 3, marginBottom: 16 }}>
        <div style={{ height: 6, width: `${((i + 1) / qs.length) * 100}%`, background: "currentColor", borderRadius: 3 }} />
      </div>
      <p style={{ margin: 0, opacity: 0.7 }}>{q.type === "x2e" ? "ye xh38 shabd english me kya vai?" : "is english shabd ki xh38 spelling kaun si vai?"}</p>
      <p style={{ fontSize: "2rem", margin: "8px 0 16px", ...(q.type === "x2e" ? XH : {}) }}>{q.prompt}</p>
      <div style={{ display: "grid", gap: 10 }}>
        {q.options.map((o, k) => (
          <button key={k} onClick={() => pick(k)}
            style={{ ...box, fontSize: "1.25rem", ...(isXh(q.type) ? XH : {}), borderColor: answers[i] === k ? "currentColor" : "#888", fontWeight: answers[i] === k ? 700 : 400, background: answers[i] === k ? "#8883" : "transparent" }}>
            {o}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        <button style={box} disabled={i === 0} onClick={() => setI(i - 1)}>← pichla</button>
        {i < qs.length - 1 ? (
          <button style={box} onClick={() => setI(i + 1)}>agla →</button>
        ) : null}
        <span style={{ flex: 1 }} />
        <button style={{ ...box, fontWeight: 700 }} disabled={busy} onClick={submit}>submit</button>
      </div>
      {err && <p style={{ color: "#d33" }}>{err}</p>}
    </main>
  );
}
