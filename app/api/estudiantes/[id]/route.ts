import { NextResponse } from "next/server";

const URL = `${process.env.GATEWAY_URL}`;

export async function DELETE(_req: Request, context: any) {
  const params = await context.params;
  const { id } = params;

  try {
    const res = await fetch(`${URL}/estudiantes/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "Error en gateway" }));
      return NextResponse.json(
        { error: err?.message || "Error al eliminar" },
        { status: res.status },
      );
    }

    return NextResponse.json({ message: "Eliminado" }, { status: 200 });
  } catch (error) {
    console.error("API DELETE error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
