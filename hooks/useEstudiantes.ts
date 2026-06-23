"use client";

import { useState } from "react";
import { Estudiante } from "@/types/estudiante.interface";
import { toast } from "sonner";

type FormData = {
  nombres: string;
  paterno: string;
  materno: string;
  direccion: string;
  sexo_id: number;
  etnia_id: number;
};

export function useEstudiantes(initial: Estudiante[]) {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function createEstudiante(
    formData: FormData,
    pendingAvatar?: File | null
  ): Promise<Estudiante | null> {
    try {
      setSubmitting(true);
      const res = await fetch("/api/estudiantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Error al crear el estudiante");
        return null;
      }

      const data = await res.json();
      const nuevo: Estudiante = data?.data || data;

      if (pendingAvatar && nuevo.id) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", pendingAvatar);
        const uploadRes = await fetch(`/api/files/upload/${nuevo.id}`, {
          method: "POST",
          body: formDataUpload,
        });
        if (!uploadRes.ok) {
          toast.warning(
            "Estudiante creado, pero hubo un error al subir el avatar"
          );
        }
      }

      setEstudiantes((prev) => [...prev, nuevo]);
      toast.success("Estudiante creado exitosamente");
      return nuevo;
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el estudiante");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function updateEstudiante(
    id: number,
    formData: FormData
  ): Promise<Estudiante | null> {
    try {
      setSubmitting(true);
      const res = await fetch(`/api/estudiantes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Error al actualizar el estudiante");
        return null;
      }

      const data = await res.json();
      const actualizado: Estudiante = data?.data || data;
      setEstudiantes((prev) =>
        prev.map((e) => (e.id === id ? actualizado : e))
      );
      toast.success("Estudiante actualizado exitosamente");
      return actualizado;
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estudiante");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteEstudiante(id: number): Promise<boolean> {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/estudiantes/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Error al eliminar el estudiante");
        return false;
      }

      setEstudiantes((prev) => prev.filter((e) => e.id !== id));
      toast.success("Estudiante eliminado exitosamente");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el estudiante");
      return false;
    } finally {
      setLoadingId(null);
    }
  }

  async function getEstudiante(id: number): Promise<Estudiante | null> {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/estudiantes/${id}`);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Error al obtener el estudiante");
        return null;
      }

      const data = await res.json();
      return data?.data || data;
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener el estudiante");
      return null;
    } finally {
      setLoadingId(null);
    }
  }

  return {
    estudiantes,
    loadingId,
    submitting,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante,
    getEstudiante,
  };
}
