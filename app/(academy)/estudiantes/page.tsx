import { getAllStudents } from "@/actions";

export default async function ObtenerEstudiantes() {
  const estudiantes = await getAllStudents();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white/60 dark:bg-black/40">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left p-3">Nombres</th>
              <th className="text-left p-3">Paterno</th>
              <th className="text-left p-3">Materno</th>
              <th className="text-left p-3">Direccion</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {estudiantes.map((est) => (
              <tr
                key={est.id}
                className="border-t odd:bg-white even:bg-gray-50 dark:odd:bg-transparent dark:even:bg-transparent"
              >
                <td className="p-3">{est.nombres}</td>
                <td className="p-3">{est.paterno}</td>
                <td className="p-3">{est.materno}</td>
                <td className="p-3">{est.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
