import data from "../data/xnglodiks.json";
import Search from "./search";

export default function Page() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1>xnglodiks</h1>
      <p style={{ opacity: 0.7 }}>xh38 shabd regex se khozo ({data.length} shabd)</p>
      <Search rows={data} />
    </main>
  );
}
