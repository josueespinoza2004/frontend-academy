import { getAllStudents } from "@/actions";
import EstudiantesTable from "./components/EstudiantesTable";

export default async function ObtenerEstudiantes() {
  const estudiantes = await getAllStudents();

  return <EstudiantesTable estudiantes={estudiantes} />;
}
