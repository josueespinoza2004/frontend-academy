"use client";

import { Estudiante } from "@/types/estudiante.interface";

type Props = {
  estudiante: Estudiante;
  onClose: () => void;
};

export default function EstudianteDetalle({ estudiante, onClose }: Props) {
  return (
    <div className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow">
      <h3 className="text-lg font-semibold mb-2">Detalle del Estudiante</h3>
      <p><strong>Nombres:</strong> {estudiante.nombres}</p>
      <p><strong>Paterno:</strong> {estudiante.paterno}</p>
      <p><strong>Materno:</strong> {estudiante.materno || "-"}</p>
      <p><strong>Dirección:</strong> {estudiante.direccion}</p>
      <p><strong>Sexo:</strong> {estudiante.sexo_id}</p>
      <p><strong>Etnia:</strong> {estudiante.etnia_id}</p>
      <button
        onClick={onClose}
        className="mt-3 px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
      >
        Cerrar
      </button>
    </div>
  );
}
