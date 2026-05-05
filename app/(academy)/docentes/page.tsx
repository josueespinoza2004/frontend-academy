import { getAllDocentes } from "@/actions/docentes";


export default async function ObtenerDocentes() {
  const docentes = await getAllDocentes();

  return;
}
