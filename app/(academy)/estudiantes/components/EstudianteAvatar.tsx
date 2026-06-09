"use client";

import { useEffect, useRef, useState } from "react";

type FileRecord = {
  id: number;
  model_id: number;
  mime: string;
  file_name: string;
};

type Props = {
  estudianteId: number;
  onClose: () => void;
};

export default function EstudianteAvatar({ estudianteId, onClose }: Props) {
  const [file, setFile] = useState<FileRecord | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAvatar();
  }, [estudianteId]);

  async function loadAvatar() {
    try {
      setLoading(true);
      const res = await fetch(`/api/files/model/${estudianteId}`);
      if (!res.ok) return;

      const data = await res.json();
      const fileData: FileRecord | null = data?.data || null;

      if (fileData) {
        setFile(fileData);
        const imgRes = await fetch(`/api/files/${fileData.id}`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData?.buffer && imgData?.file) {
            const buffer = new Uint8Array(imgData.buffer);
            const blob = new Blob([buffer], { type: imgData.file.mime });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar avatar:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`/api/files/upload/${estudianteId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Error al subir el avatar");
        return;
      }

      await loadAvatar();
    } catch (error) {
      console.error("Error al subir avatar:", error);
      alert("Error al subir el avatar");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!file) return;

    const confirmDelete = confirm("¿Eliminar el avatar? Esta acción no puede deshacerse.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/files/${file.id}`, { method: "DELETE" });

      if (!res.ok) {
        alert("Error al eliminar el avatar");
        return;
      }

      setFile(null);
      setImageUrl(null);
    } catch (error) {
      console.error("Error al eliminar avatar:", error);
      alert("Error al eliminar el avatar");
    }
  }

  return (
    <div className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow">
      <h3 className="text-lg font-semibold mb-3">Avatar del Estudiante</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando...</p>
      ) : (
        <>
          {imageUrl ? (
            <div className="flex flex-col items-start gap-3">
              <img
                src={imageUrl}
                alt="Avatar del estudiante"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {uploading ? "Subiendo..." : "Cambiar Avatar"}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Sin avatar</span>
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {uploading ? "Subiendo..." : "Subir Avatar"}
              </button>
            </div>
          )}
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      <button
        onClick={onClose}
        className="mt-3 px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
      >
        Cerrar
      </button>
    </div>
  );
}
