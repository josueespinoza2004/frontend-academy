import { getAllDocentes } from "@/actions/docentes";
import DocentesTable from "./components/DocentesTable";

export default async function ObtenerDocentes() {
  const docentes = await getAllDocentes();

  return <DocentesTable docentes={docentes} />;
}
