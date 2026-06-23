"use client";

import { useEffect, useState } from "react";
import { Estudiante } from "@/types/estudiante.interface";
import EstudianteForm from "./EstudianteForm";
import EstudianteDetalle from "./EstudianteDetalle";
import { toast } from "sonner";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const SEXOS: Record<number, string> = {
  1: "Masculino",
  2: "Femenino",
};

const ETNIAS: Record<number, string> = {
  1: "Mestizo",
  2: "Indígena",
  3: "Afroecuatoriano",
  4: "Montubio",
  5: "Blanco",
  6: "Otro",
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
  const [avatars, setAvatars] = useState<Record<number, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    estudiantes.forEach((est) => {
      loadAvatarUrl(est.id);
    });
  }, [estudiantes]);

  async function loadAvatarUrl(estudianteId: number) {
    try {
      const res = await fetch(`/api/files/model/${estudianteId}`);
      if (!res.ok) return;

      const data = await res.json();
      const fileData = data?.data;

      if (fileData) {
        const imgRes = await fetch(`/api/files/${fileData.id}`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData?.buffer && imgData?.file) {
            const buffer = new Uint8Array(imgData.buffer);
            const blob = new Blob([buffer], { type: imgData.file.mime });
            const url = URL.createObjectURL(blob);
            setAvatars((prev) => ({ ...prev, [estudianteId]: url }));
          }
        } else if (imgRes.status === 404) {
          await fetch(`/api/files/${fileData.id}`, { method: "DELETE" });
          console.log(`Avatar huérfano limpiado para estudiante ${estudianteId}`);
        }
      }
    } catch (error) {
      console.error("Error al cargar avatar:", error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sexo_id" || name === "etnia_id" ? Number(value) : value,
    }));
  }

  function handleSelectChange(name: string, value: string | null) {
    if (value === null) return;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
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
        toast.error(err?.error || "Error al crear el estudiante");
        return;
      }

      const data = await res.json();
      const nuevo: Estudiante = data?.data || data;
      setEstudiantes((prev) => [...prev, nuevo]);
      setFormData(emptyForm);
      setShowForm(false);
      toast.success("Estudiante creado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el estudiante");
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
        toast.error(err?.error || "Error al obtener el estudiante");
        return;
      }

      const data = await res.json();
      const estudiante: Estudiante = data?.data || data;
      setViewStudent(estudiante);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener el estudiante");
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
        toast.error(err?.error || "Error al actualizar el estudiante");
        return;
      }

      const data = await res.json();
      const actualizado: Estudiante = data?.data || data;
      setEstudiantes((prev) =>
        prev.map((e) => (e.id === editingId ? actualizado : e))
      );
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      toast.success("Estudiante actualizado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estudiante");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoadingId(id);
      const res = await fetch(`/api/estudiantes/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Error al eliminar el estudiante");
        return;
      }

      setEstudiantes((prev) => prev.filter((e) => e.id !== id));
      toast.success("Estudiante eliminado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el estudiante");
    } finally {
      setLoadingId(null);
      setDeleteConfirm(null);
    }
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  function getInitials(est: Estudiante) {
    return `${est.nombres.charAt(0)}${est.paterno.charAt(0)}`.toUpperCase();
  }

  return (
    <div className="space-y-6">
      {/* Detalle modal */}
      <EstudianteDetalle
        estudiante={viewStudent}
        avatarUrl={viewStudent ? avatars[viewStudent.id] || null : null}
        onClose={() => setViewStudent(null)}
      />

      {/* Form dialog */}
      <EstudianteForm
        open={showForm}
        formData={formData}
        editingId={editingId}
        submitting={submitting}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        onSubmit={editingId ? handleUpdate : handleCreate}
        onCancel={handleCancelForm}
        onAvatarChange={() => {
          if (editingId) loadAvatarUrl(editingId);
        }}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminacion</DialogTitle>
            <DialogDescription>
              Esta accion no puede deshacerse. Se eliminara el estudiante y
              todos sus datos asociados permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={loadingId === deleteConfirm}
            >
              {loadingId === deleteConfirm && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estudiantes</h2>
          <p className="text-muted-foreground">
            Gestiona los estudiantes del sistema academico
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData(emptyForm);
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Estudiante
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {estudiantes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <UserCircle className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">
                No hay estudiantes registrados
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comienza creando un nuevo estudiante
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setEditingId(null);
                  setFormData(emptyForm);
                  setShowForm(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Estudiante
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Avatar</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Direccion</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Etnia</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudiantes.map((est) => (
                  <TableRow key={est.id}>
                    <TableCell>
                      <Avatar className="h-9 w-9">
                        {avatars[est.id] && (
                          <AvatarImage src={avatars[est.id]} alt={est.nombres} />
                        )}
                        <AvatarFallback className="text-xs">
                          {getInitials(est)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {est.nombres} {est.paterno}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {est.materno || "—"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{est.direccion}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {SEXOS[est.sexo_id] || est.sexo_id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        {ETNIAS[est.etnia_id] || est.etnia_id}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleGetOne(est.id)}
                          disabled={loadingId === est.id}
                          title="Ver detalle"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          {loadingId === est.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(est)}
                          title="Editar"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(est.id)}
                          disabled={loadingId === est.id}
                          title="Eliminar"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
