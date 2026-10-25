"use client";

import { useLanguage } from "@/lib/LanguageContext";
import languagesData from "@/data/xnglo_languages.json";

export default function LanguagePicker() {
  const { lang, setLang } = useLanguage();

  return (
    <select
      value={lang}
      onChange={e => setLang(e.target.value)}
      title="bhasha change karo"
      style={{
        padding: "0.4rem 0.6rem",
        borderRadius: "6px",
        border: "1px solid #333",
        background: "#111",
        color: "#fff",
        fontSize: "0.85rem",
        cursor: "pointer",
      }}
    >
      {languagesData.languages.map(l => (
        <option key={l.code} value={l.code}>
          {l.code} - {l.native}
        </option>
      ))}
    </select>
  );
}
