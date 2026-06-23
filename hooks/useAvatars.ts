"use client";

import { useEffect, useState } from "react";

export function useAvatars(estudianteIds: number[]) {
  const [avatars, setAvatars] = useState<Record<number, string>>({});

  useEffect(() => {
    estudianteIds.forEach((id) => {
      if (!avatars[id]) {
        loadAvatarUrl(id);
      }
    });
  }, [estudianteIds]);

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

  function reloadAvatar(estudianteId: number) {
    // Limpiar el avatar actual para forzar recarga
    setAvatars((prev) => {
      const copy = { ...prev };
      delete copy[estudianteId];
      return copy;
    });
    loadAvatarUrl(estudianteId);
  }

  return { avatars, reloadAvatar };
}
