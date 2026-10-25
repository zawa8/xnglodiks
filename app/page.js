import data from "../data/xnglodiks.json";
import Search from "./search";
export default function Page() {
  return (<main><h1>xnglodiks</h1><Search rows={data} /></main>);
}
