import { NextResponse } from "next/server";

const URL = `${process.env.GATEWAY_URL}`;

export async function POST(req: Request, context: any) {
  const params = await context.params;
  const { modelId } = params;

  try {
    const formData = await req.formData();

    const res = await fetch(`${URL}/files/upload/${modelId}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "Error en gateway" }));
      return NextResponse.json(
        { error: err?.message || "Error al subir archivo" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API POST file upload error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
