import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({
  district: z.string().min(2),
  bedrooms: z.number().int().positive(),
  priceMax: z.number().positive(),
  ageMax: z.number().int().nonnegative(),
  parkingMin: z.number().int().nonnegative(),
  areaMin: z.number().nonnegative(),
  currency: z.enum(["USD","PEN"]).default("USD"),
  zones: z.array(z.object({ lat: z.number(), lng: z.number(), radiusKm: z.number() })).optional()
});
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const filters = parsed.data;
  // Placeholder minimal response
  const results = [{
    title: "Depto 3D con balcón • Miraflores",
    url: "https://urbania.pe/",
    source: "urbania.pe",
    price: "USD 240,000",
    location: "Miraflores",
    summary: "3 dormitorios, 2 baños, 110 m², balcón, 1 cochera, 8 años.",
    contactName: "Asesor Demo",
    contactPhone: "+51 999 999 999",
    score: 0.96
  }];
  const alternatives: any[] = [];
  return NextResponse.json({ results, alternatives, filters });
}
