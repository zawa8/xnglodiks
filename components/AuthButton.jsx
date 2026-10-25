"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span style={{ opacity: 0.5, fontSize: "0.85rem" }}>...</span>;
  }

  if (session) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {session.user.image && (
          <img
            src={session.user.image}
            alt=""
            style={{ width: 28, height: 28, borderRadius: "50%" }}
          />
        )}
        <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          {session.user.name}
        </span>
        <button
          onClick={() => signOut()}
          style={{
            padding: "0.3rem 0.6rem",
            borderRadius: "6px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          sain aut
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      style={{
        padding: "0.4rem 0.75rem",
        borderRadius: "6px",
        border: "1px solid #333",
        background: "#fff",
        color: "#000",
        fontSize: "0.85rem",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      sain in
    </button>
  );
}
