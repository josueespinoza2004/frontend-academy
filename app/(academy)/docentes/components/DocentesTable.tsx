"use client";

import { useState } from "react";
import { Docente } from "@/types/docente.interface";
import DocenteForm from "./DocenteForm";
import DocenteDetalle from "./DocenteDetalle";

type FormData = {
  nombres: string;
  apellidos: string;
  email: string;
  direccion: string;
  cedula: string;
  telefono: string;
  sexo_id: number;
  etnia_id: number;
  cargo_id: number;
};

const emptyForm: FormData = {
  nombres: "",
  apellidos: "",
  email: "",
  direccion: "",
  cedula: "",
  telefono: "",
  sexo_id: 1,
  etnia_id: 1,
  cargo_id: 1,
};

type Props = {
  docentes: Docente[];
};

export default function DocentesTable({ docentes: initial }: Props) {
  const [docentes, setDocentes] = useState<Docente[]>(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [viewDocente, setViewDocente] = useState<Docente | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sexo_id" || name === "etnia_id" || name === "cargo_id"
          ? Number(value)
          : value,
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("/api/docentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Error al crear el docente");
        return;
      }

      const data = await res.json();
      const nuevo: Docente = data?.data || data;
      setDocentes((prev) => [...prev, nuevo]);
      setFormData(emptyForm);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error al crear el docente");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGetOne(id: number) {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/docentes/${id}`);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Error al obtener el docente");
        return;
      }

      const data = await res.json();
      const docente: Docente = data?.data || data;
      setViewDocente(docente);
    } catch (error) {
      console.error(error);
      alert("Error al obtener el docente");
    } finally {
      setLoadingId(null);
    }
  }

  function handleEditClick(doc: Docente) {
    setEditingId(doc.id);
    setFormData({
      nombres: doc.nombres,
      apellidos: doc.apellidos,
      email: doc.email,
      direccion: doc.direccion,
      cedula: doc.cedula,
      telefono: doc.telefono,
      sexo_id: doc.sexo_id,
      etnia_id: doc.etnia_id,
      cargo_id: doc.cargo_id,
    });
    setShowForm(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/docentes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Error al actualizar el docente");
        return;
      }

      const data = await res.json();
      const actualizado: Docente = data?.data || data;
      setDocentes((prev) =>
        prev.map((d) => (d.id === editingId ? actualizado : d)),
      );
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el docente");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "¿Eliminar este docente? Esta acción no puede deshacerse.",
    );
    if (!confirmDelete) return;

    try {
      setLoadingId(id);
      const res = await fetch(`/api/docentes/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Error al eliminar el docente");
        return;
      }

      setDocentes((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el docente");
    } finally {
      setLoadingId(null);
    }
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {viewDocente && (
        <DocenteDetalle
          docente={viewDocente}
          onClose={() => setViewDocente(null)}
        />
      )}

      {showForm && (
        <DocenteForm
          formData={formData}
          editingId={editingId}
          submitting={submitting}
          onChange={handleChange}
          onSubmit={editingId ? handleUpdate : handleCreate}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && (
        <button
          onClick={() => {
            setEditingId(null);
            setFormData(emptyForm);
            setShowForm(true);
          }}
          className="mb-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
        >
          Crear Docente
        </button>
      )}

      <div className="overflow-x-auto rounded-lg shadow-sm bg-white/60 dark:bg-black/40">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="text-left p-3">Nombres</th>
              <th className="text-left p-3">Apellidos</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Dirección</th>
              <th className="text-left p-3">Cédula</th>
              <th className="text-left p-3">Teléfono</th>
              <th className="text-left p-3">Sexo</th>
              <th className="text-left p-3">Etnia</th>
              <th className="text-left p-3">Cargo</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {docentes.map((doc) => (
              <tr
                key={doc.id}
                className="border-t odd:bg-white even:bg-gray-50 dark:odd:bg-transparent dark:even:bg-transparent"
              >
                <td className="p-3">{doc.nombres}</td>
                <td className="p-3">{doc.apellidos}</td>
                <td className="p-3">{doc.email}</td>
                <td className="p-3">{doc.direccion}</td>
                <td className="p-3">{doc.cedula}</td>
                <td className="p-3">{doc.telefono}</td>
                <td className="p-3">{doc.sexo_id}</td>
                <td className="p-3">{doc.etnia_id}</td>
                <td className="p-3">{doc.cargo_id}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleGetOne(doc.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-60"
                    disabled={loadingId === doc.id}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleEditClick(doc)}
                    className="px-3 py-1 text-sm font-medium text-white bg-amber-600 rounded hover:bg-amber-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-60"
                    disabled={loadingId === doc.id}
                  >
                    {loadingId === doc.id ? "Eliminando..." : "Eliminar"}
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
