"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type FormData = {
  nombres: string;
  paterno: string;
  materno: string;
  direccion: string;
  sexo_id: number;
  etnia_id: number;
};

type FileRecord = {
  id: number;
  model_id: number;
  mime: string;
  file_name: string;
};

type Props = {
  open: boolean;
  formData: FormData;
  editingId: number | null;
  submitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onAvatarChange?: () => void;
};

export default function EstudianteForm({
  open,
  formData,
  editingId,
  submitting,
  onChange,
  onSelectChange,
  onSubmit,
  onCancel,
  onAvatarChange,
}: Props) {
  const [avatarFile, setAvatarFile] = useState<FileRecord | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) {
      loadAvatar(editingId);
    } else {
      setAvatarFile(null);
      setAvatarUrl(null);
    }
  }, [editingId]);

  async function loadAvatar(estudianteId: number) {
    try {
      const res = await fetch(`/api/files/model/${estudianteId}`);
      if (!res.ok) return;

      const data = await res.json();
      const fileData: FileRecord | null = data?.data || null;

      if (fileData) {
        setAvatarFile(fileData);
        const imgRes = await fetch(`/api/files/${fileData.id}`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData?.buffer && imgData?.file) {
            const buffer = new Uint8Array(imgData.buffer);
            const blob = new Blob([buffer], { type: imgData.file.mime });
            const url = URL.createObjectURL(blob);
            setAvatarUrl(url);
          }
        } else if (imgRes.status === 404) {
          await fetch(`/api/files/${fileData.id}`, { method: "DELETE" });
          setAvatarFile(null);
          setAvatarUrl(null);
          console.log(`Avatar huérfano limpiado para estudiante ${estudianteId}`);
        }
      }
    } catch (error) {
      console.error("Error al cargar avatar:", error);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !editingId) return;

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);

      const res = await fetch(`/api/files/upload/${editingId}`, {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) {
        toast.error("Error al subir el avatar");
        return;
      }

      await loadAvatar(editingId);
      onAvatarChange?.();
      toast.success("Avatar actualizado");
    } catch (error) {
      console.error("Error al subir avatar:", error);
      toast.error("Error al subir el avatar");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteAvatar() {
    if (!avatarFile) return;

    try {
      const res = await fetch(`/api/files/${avatarFile.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Error al eliminar el avatar");
        return;
      }

      setAvatarFile(null);
      setAvatarUrl(null);
      onAvatarChange?.();
      toast.success("Avatar eliminado");
    } catch (error) {
      console.error("Error al eliminar avatar:", error);
      toast.error("Error al eliminar el avatar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingId ? "Editar Estudiante" : "Nuevo Estudiante"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Avatar section - only when editing */}
          {editingId && (
            <>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
                    <AvatarFallback className="text-lg">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-3.5 w-3.5" />
                    {avatarUrl ? "Cambiar" : "Subir avatar"}
                  </Button>
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteAvatar}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Eliminar
                    </Button>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </div>
              <Separator />
            </>
          )}

          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={onChange}
                placeholder="Juan Carlos"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paterno">Apellido Paterno</Label>
              <Input
                id="paterno"
                name="paterno"
                value={formData.paterno}
                onChange={onChange}
                placeholder="Garcia"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="materno">Apellido Materno</Label>
              <Input
                id="materno"
                name="materno"
                value={formData.materno}
                onChange={onChange}
                placeholder="Lopez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Direccion</Label>
              <Input
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={onChange}
                placeholder="Av. Principal 123"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select
                value={String(formData.sexo_id)}
                onValueChange={(val) => onSelectChange("sexo_id", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Masculino</SelectItem>
                  <SelectItem value="2">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Etnia</Label>
              <Select
                value={String(formData.etnia_id)}
                onValueChange={(val) => onSelectChange("etnia_id", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Mestizo</SelectItem>
                  <SelectItem value="2">Indigena</SelectItem>
                  <SelectItem value="3">Afroecuatoriano</SelectItem>
                  <SelectItem value="4">Montubio</SelectItem>
                  <SelectItem value="5">Blanco</SelectItem>
                  <SelectItem value="6">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
