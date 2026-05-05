import { NextResponse } from "next/server";

const URL = `${process.env.GATEWAY_URL}`;

export async function GET(_req: Request, context: any) {
  const params = await context.params;
  const { id } = params;

  try {
    const res = await fetch(`${URL}/docentes/${id}`);

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "Error en gateway" }));
      return NextResponse.json(
        { error: err?.message || "Error al obtener" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API GET error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, context: any) {
  const params = await context.params;
  const { id } = params;

  try {
    const body = await req.json();

    const res = await fetch(`${URL}/docentes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "Error en gateway" }));
      return NextResponse.json(
        { error: err?.message || "Error al actualizar" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API PUT error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, context: any) {
  const params = await context.params;
  const { id } = params;

  try {
    const res = await fetch(`${URL}/docentes/${id}`, { method: "DELETE" });

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
