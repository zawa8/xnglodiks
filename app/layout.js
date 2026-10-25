import { ALL_FONT_VARIABLES } from "@/components/hsciifp/varfonts";

export const metadata = { title: "xnglodiks", description: "e26 / e23 / xh38 dictionary" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ALL_FONT_VARIABLES} style={{ fontFamily: "system-ui, sans-serif", margin: 16 }}>
        {children}
      </body>
    </html>
  );
}
