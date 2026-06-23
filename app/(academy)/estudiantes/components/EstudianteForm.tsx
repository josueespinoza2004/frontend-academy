"use client";

import { useEffect, useRef, useState } from "react";

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
  formData: FormData;
  editingId: number | null;
  submitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onAvatarChange?: () => void;
};

export default function EstudianteForm({
  formData,
  editingId,
  submitting,
  onChange,
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
        alert("Error al subir el avatar");
        return;
      }

      await loadAvatar(editingId);
      onAvatarChange?.();
    } catch (error) {
      console.error("Error al subir avatar:", error);
      alert("Error al subir el avatar");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteAvatar() {
    if (!avatarFile) return;

    const confirmDelete = confirm("¿Eliminar el avatar?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/files/${avatarFile.id}`, { method: "DELETE" });

      if (!res.ok) {
        alert("Error al eliminar el avatar");
        return;
      }

      setAvatarFile(null);
      setAvatarUrl(null);
      onAvatarChange?.();
    } catch (error) {
      console.error("Error al eliminar avatar:", error);
      alert("Error al eliminar el avatar");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow"
    >
      <h3 className="text-lg font-semibold mb-3">
        {editingId ? "Editar Estudiante" : "Crear Estudiante"}
      </h3>

      {editingId && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Avatar</label>
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-xs">Sin avatar</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {uploading ? "Subiendo..." : avatarUrl ? "Cambiar" : "Subir Avatar"}
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
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
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input
            name="nombres"
            value={formData.nombres}
            onChange={onChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Paterno</label>
          <input
            name="paterno"
            value={formData.paterno}
            onChange={onChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Materno</label>
          <input
            name="materno"
            value={formData.materno}
            onChange={onChange}
            className="w-full p-2 border rounded dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            name="direccion"
            value={formData.direccion}
            onChange={onChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sexo ID</label>
          <input
            name="sexo_id"
            type="number"
            value={formData.sexo_id}
            onChange={onChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Etnia ID</label>
          <input
            name="etnia_id"
            type="number"
            value={formData.etnia_id}
            onChange={onChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-800"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting
            ? "Guardando..."
            : editingId
              ? "Actualizar"
              : "Crear"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
