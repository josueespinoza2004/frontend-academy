"use client";

import { useState } from "react";
import { Estudiante } from "@/types/estudiante.interface";
import EstudianteForm from "./EstudianteForm";
import EstudianteDetalle from "./EstudianteDetalle";

type FormData = {
  nombres: string;
  paterno: string;
  materno: string;
  direccion: string;
  sexo_id: number;
  etnia_id: number;
};

const emptyForm: FormData = {
  nombres: "",
  paterno: "",
  materno: "",
  direccion: "",
  sexo_id: 1,
  etnia_id: 1,
};

type Props = {
  estudiantes: Estudiante[];
};

export default function EstudiantesTable({ estudiantes: initial }: Props) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [viewStudent, setViewStudent] = useState<Estudiante | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sexo_id" || name === "etnia_id" ? Number(value) : value,
    }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("/api/estudiantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Error al crear el estudiante");
        return;
      }

      const data = await res.json();
      const nuevo: Estudiante = data?.data || data;
      setEstudiantes((prev) => [...prev, nuevo]);
      setFormData(emptyForm);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error al crear el estudiante");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGetOne(id: number) {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/estudiantes/${id}`);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Error al obtener el estudiante");
        return;
      }

      const data = await res.json();
      const estudiante: Estudiante = data?.data || data;
      setViewStudent(estudiante);
    } catch (error) {
      console.error(error);
      alert("Error al obtener el estudiante");
    } finally {
      setLoadingId(null);
    }
  }

  function handleEditClick(est: Estudiante) {
    setEditingId(est.id);
    setFormData({
      nombres: est.nombres,
      paterno: est.paterno,
      materno: est.materno || "",
      direccion: est.direccion,
      sexo_id: est.sexo_id,
      etnia_id: est.etnia_id,
    });
    setShowForm(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/estudiantes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || "Error al actualizar el estudiante");
        return;
      }

      const data = await res.json();
      const actualizado: Estudiante = data?.data || data;
      setEstudiantes((prev) =>
        prev.map((e) => (e.id === editingId ? actualizado : e)),
      );
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el estudiante");
    } finally {
      setSubmitting(false);
    }
  }

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

  function handleCancelForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {viewStudent && (
        <EstudianteDetalle
          estudiante={viewStudent}
          onClose={() => setViewStudent(null)}
        />
      )}

      {showForm && (
        <EstudianteForm
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
          Crear Estudiante
        </button>
      )}

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
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleGetOne(est.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-60"
                    disabled={loadingId === est.id}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleEditClick(est)}
                    className="px-3 py-1 text-sm font-medium text-white bg-amber-600 rounded hover:bg-amber-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(est.id)}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-60"
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
