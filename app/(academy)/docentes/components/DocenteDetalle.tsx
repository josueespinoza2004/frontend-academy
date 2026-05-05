"use client";

import { Docente } from "@/types/docente.interface";

type Props = {
  docente: Docente;
  onClose: () => void;
};

export default function DocenteDetalle({ docente, onClose }: Props) {
  return (
    <div className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow">
      <h3 className="text-lg font-semibold mb-2">Detalle del Docente</h3>
      <p><strong>Nombres:</strong> {docente.nombres}</p>
      <p><strong>Apellidos:</strong> {docente.apellidos}</p>
      <p><strong>Email:</strong> {docente.email}</p>
      <p><strong>Dirección:</strong> {docente.direccion}</p>
      <p><strong>Cédula:</strong> {docente.cedula}</p>
      <p><strong>Teléfono:</strong> {docente.telefono}</p>
      <p><strong>Sexo:</strong> {docente.sexo_id}</p>
      <p><strong>Etnia:</strong> {docente.etnia_id}</p>
      <p><strong>Cargo:</strong> {docente.cargo_id}</p>
      <button
        onClick={onClose}
        className="mt-3 px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
      >
        Cerrar
      </button>
    </div>
  );
}
