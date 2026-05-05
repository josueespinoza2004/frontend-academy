"use client";

import { useState } from "react";
import { Estudiante } from "@/types/estudiante.interface";

type Props = {
  estudiantes: Estudiante[];
};

export default function EstudiantesTable({ estudiantes: initial }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "¿Eliminar este estudiante? Esta acción no puede deshacerse.",
    );
    if (!confirmDelete) return;

    try {
      setLoadingId(id);
      const res = await fetch(`/api/estudiantes/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Error al eliminar el estudiante");
        return;
      }

      setEstudiantes((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el estudiante");
    } finally {
      setLoadingId(null);
    }
  }

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
              <th className="text-left p-3">Sexo</th>
              <th className="text-left p-3">Etnia</th>
              <th className="text-left p-3">Acciones</th>
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
                <td className="p-3">{est.sexo_id}</td>
                <td className="p-3">{est.etnia_id}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(est.id)}
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-60"
                    disabled={loadingId === est.id}
                  >
                    {loadingId === est.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
