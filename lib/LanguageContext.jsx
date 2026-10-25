"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("xh38");
  const [fontFamily, setFontFamily] = useState("var(--xh38ascfont)");

  // load saved language
  useEffect(() => {
    const saved = localStorage.getItem("xnglo-lang");
    if (saved) setLang(saved);
  }, []);

  // apply font when lang changes
  useEffect(() => {
    localStorage.setItem("xnglo-lang", lang);
    const f = `var(--${lang}ascfont)`;
    setFontFamily(f);
    document.body.style.fontFamily = f;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, fontFamily }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
