import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Leemos el body de la petición
    const body = await req.json();

    // 👇 ejemplo: simular resultados de búsqueda
    const results = [
      { id: 1, name: "Departamento en Miraflores", price: 250000 },
      { id: 2, name: "Casa en Surco", price: 350000 },
    ];

    const alternatives = [
      { id: 3, name: "Loft en Barranco", price: 200000 },
    ];

    // Respuesta exitosa
    return NextResponse.json({
      results,
      alternatives,
      filters: body, // devuelvo lo que me mandes como filtros
    });
  } catch (err: any) {
    console.error("Error en /api/search:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
