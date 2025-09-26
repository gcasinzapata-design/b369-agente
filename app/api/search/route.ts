// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q") || "";

  // 🔍 aquí iría tu lógica, por ejemplo consulta a Prisma, fetch a API, etc.
  const results = [
    { id: 1, title: "Resultado A", query },
    { id: 2, title: "Resultado B", query },
  ];

  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Aquí procesas los datos recibidos
  return NextResponse.json({
    success: true,
    received: body,
  });
}
