"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const btn = {
  padding: "0.35rem 0.7rem", borderRadius: 6, border: "1px solid #888",
  background: "transparent", color: "inherit", fontSize: "0.9rem", cursor: "pointer", textDecoration: "none",
};

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const who = user ? (user.email || user.phone || "") : "";

  return (
    <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <Link href="/" style={{ ...btn, fontWeight: 700 }}>xnglodiks</Link>
      <Link href="/quiz" style={btn}>kuiz</Link>
      <span style={{ flex: 1 }} />
      {user ? (
        <>
          <span style={{ fontSize: "0.8rem", opacity: 0.7, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{who}</span>
          <button style={btn} onClick={() => getSupabase()?.auth.signOut()}>sain aut</button>
        </>
      ) : (
        <Link href="/login" style={btn}>sain in</Link>
      )}
    </header>
  );
}
