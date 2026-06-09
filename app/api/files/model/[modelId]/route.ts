import { NextResponse } from "next/server";

const URL = `${process.env.GATEWAY_URL}`;

export async function GET(_req: Request, context: any) {
  const params = await context.params;
  const { modelId } = params;

  try {
    const res = await fetch(`${URL}/files/model/${modelId}`);

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "Error en gateway" }));
      return NextResponse.json(
        { error: err?.message || "Error al obtener archivo" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API GET file by model error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
