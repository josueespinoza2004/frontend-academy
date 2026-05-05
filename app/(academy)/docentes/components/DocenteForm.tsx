"use client";

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

type Props = {
  formData: FormData;
  editingId: number | null;
  submitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function DocenteForm({
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
        {editingId ? "Editar Docente" : "Crear Docente"}
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
          name="apellidos"
          value={formData.apellidos}
          onChange={onChange}
          placeholder="Apellidos"
          required
          className="p-2 border rounded dark:bg-gray-800"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          required
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
          name="cedula"
          value={formData.cedula}
          onChange={onChange}
          placeholder="Cédula"
          required
          className="p-2 border rounded dark:bg-gray-800"
        />
        <input
          name="telefono"
          value={formData.telefono}
          onChange={onChange}
          placeholder="Teléfono"
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
        <input
          name="cargo_id"
          type="number"
          value={formData.cargo_id}
          onChange={onChange}
          placeholder="Cargo ID"
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
