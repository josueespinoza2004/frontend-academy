import { NextResponse } from "next/server";

const URL = `${process.env.GATEWAY_URL}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${URL}/docentes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "Error en gateway" }));
      return NextResponse.json(
        { error: err?.message || "Error al crear" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API POST error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
