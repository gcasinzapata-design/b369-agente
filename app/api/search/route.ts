import type { NextRequest } from "next/server";
import { haversineKm, geocodeDistrictCentroid } from "../../../lib/geo";
import { buildQueries } from "../../../lib/search";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const q = buildQueries(body);

    // Aquí podrías usar haversineKm, geocodeDistrictCentroid y q
    // Ejemplo mínimo para que compile
    return new Response(JSON.stringify({ success: true, query: q }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en /api/search:", error);
    return new Response(
      JSON.stringify({ error: "Error interno en el servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
