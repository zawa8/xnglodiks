"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const box = { padding: 10, border: "1px solid #888", borderRadius: 6, fontSize: "1rem", background: "transparent", color: "inherit", boxSizing: "border-box" };

// 10 digit number = india (+91), anything else must start with + or country code
function normalizePhone(s) {
  const d = s.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return d;
  if (d.length === 10) return "+91" + d;
  return "+" + d;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("email");
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const target = () => (mode === "email" ? { email: id.trim() } : { phone: normalizePhone(id) });

  async function run(fn) {
    const sb = getSupabase();
    if (!sb) { setMsg("supabase config nvi vai (env vars)"); return; }
    setBusy(true); setMsg("");
    try { await fn(sb); } catch (e) { setMsg(e.message); }
    setBusy(false);
  }

  const send = () => run(async sb => {
    const { error } = await sb.auth.signInWithOtp({ ...target(), options: { shouldCreateUser: true } });
    if (error) throw error;
    setSent(true);
    setMsg(mode === "email" ? "email pe code bheza gya" : "sms pe code bheza gya");
  });

  const verify = () => run(async sb => {
    const { error } = await sb.auth.verifyOtp({ ...target(), token: code.trim(), type: mode === "email" ? "email" : "sms" });
    if (error) throw error;
    router.push("/quiz");
  });

  function switchMode(m) { setMode(m); setId(""); setCode(""); setSent(false); setMsg(""); }

  return (
    <main style={{ maxWidth: 380 }}>
      <h1>sain in / registar</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["email", "mobail"].map(m => {
          const val = m === "email" ? "email" : "phone";
          return (
            <button key={m} onClick={() => switchMode(val)}
              style={{ ...box, cursor: "pointer", fontWeight: mode === val ? 700 : 400, borderColor: mode === val ? "currentColor" : "#888" }}>{m}</button>
          );
        })}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <input value={id} onChange={e => setId(e.target.value)} disabled={sent}
          type={mode === "email" ? "email" : "tel"} inputMode={mode === "email" ? "email" : "tel"}
          placeholder={mode === "email" ? "tumhara@email.com" : "+91XXXXXXXXXX"} style={box} />
        {sent && (
          <input value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code"
            placeholder="otp code" style={{ ...box, letterSpacing: 4 }} />
        )}
        {!sent ? (
          <button onClick={send} disabled={busy || !id.trim()} style={{ ...box, cursor: "pointer" }}>otp bhezo</button>
        ) : (
          <>
            <button onClick={verify} disabled={busy || !code.trim()} style={{ ...box, cursor: "pointer", fontWeight: 700 }}>verify karo</button>
            <button onClick={() => { setSent(false); setCode(""); setMsg(""); }} style={{ ...box, cursor: "pointer", opacity: 0.7 }}>number/email badlo</button>
          </>
        )}
      </div>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>nayi id pe pehli bar otp verify vone pe account khud ban zata vai.</p>
    </main>
  );
}
