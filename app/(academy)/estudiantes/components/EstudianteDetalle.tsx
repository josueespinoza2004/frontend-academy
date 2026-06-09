"use client";

import { Estudiante } from "@/types/estudiante.interface";

type Props = {
  estudiante: Estudiante;
  avatarUrl: string | null;
  onClose: () => void;
};

export default function EstudianteDetalle({ estudiante, avatarUrl, onClose }: Props) {
  return (
    <div className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow">
      <h3 className="text-lg font-semibold mb-3">Detalle del Estudiante</h3>
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar del estudiante"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Sin avatar</span>
            </div>
          )}
        </div>
        <div>
          <p><strong>Nombres:</strong> {estudiante.nombres}</p>
          <p><strong>Paterno:</strong> {estudiante.paterno}</p>
          <p><strong>Materno:</strong> {estudiante.materno || "-"}</p>
          <p><strong>Dirección:</strong> {estudiante.direccion}</p>
          <p><strong>Sexo:</strong> {estudiante.sexo_id}</p>
          <p><strong>Etnia:</strong> {estudiante.etnia_id}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-3 px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
      >
        Cerrar
      </button>
    </div>
  );
}
