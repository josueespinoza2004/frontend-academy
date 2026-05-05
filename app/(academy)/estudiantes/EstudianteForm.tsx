"use client";

type FormData = {
  nombres: string;
  paterno: string;
  materno: string;
  direccion: string;
  sexo_id: number;
  etnia_id: number;
};

type Props = {
  formData: FormData;
  editingId: number | null;
  submitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function EstudianteForm({
  formData,
  editingId,
  submitting,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow"
    >
      <h3 className="text-lg font-semibold mb-3">
        {editingId ? "Editar Estudiante" : "Crear Estudiante"}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <input
          name="nombres"
          value={formData.nombres}
          onChange={onChange}
          placeholder="Nombres"
          required
          className="p-2 border rounded dark:bg-gray-800"
        />
        <input
          name="paterno"
          value={formData.paterno}
          onChange={onChange}
          placeholder="Paterno"
          required
          className="p-2 border rounded dark:bg-gray-800"
        />
        <input
          name="materno"
          value={formData.materno}
          onChange={onChange}
          placeholder="Materno"
          className="p-2 border rounded dark:bg-gray-800"
        />
        <input
          name="direccion"
          value={formData.direccion}
          onChange={onChange}
          placeholder="Dirección"
          required
          className="p-2 border rounded dark:bg-gray-800"
        />
        <input
          name="sexo_id"
          type="number"
          value={formData.sexo_id}
          onChange={onChange}
          placeholder="Sexo ID"
          required
          className="p-2 border rounded dark:bg-gray-800"
        />
        <input
          name="etnia_id"
          type="number"
          value={formData.etnia_id}
          onChange={onChange}
          placeholder="Etnia ID"
          required
          className="p-2 border rounded dark:bg-gray-800"
        />
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
