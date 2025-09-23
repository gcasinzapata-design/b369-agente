"use client";
import { useState, useCallback } from "react";
import { z } from "zod";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
const MapZones = dynamic(() => import("./MapZones"), { ssr: false });
const schema = z.object({
  district: z.string().min(2, "Distrito requerido"),
  bedrooms: z.coerce.number().int().positive(),
  priceMax: z.coerce.number().positive(),
  ageMax: z.coerce.number().int().nonnegative(),
  parkingMin: z.coerce.number().int().nonnegative(),
  areaMin: z.coerce.number().nonnegative(),
  currency: z.enum(["USD","PEN"]).default("USD"),
  zones: z.array(z.object({ lat: z.number(), lng: z.number(), radiusKm: z.number() })).optional()
});
export type Filters = z.infer<typeof schema>;
export default function FilterForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [zones, setZones] = useState<{lat:number;lng:number;radiusKm:number}[]>([]);
  const onZonesChange = useCallback((z:any[]) => setZones(z), []);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const data: any = {
      district: form.get("district")?.toString() || "",
      bedrooms: form.get("bedrooms"),
      priceMax: form.get("priceMax"),
      ageMax: form.get("ageMax"),
      parkingMin: form.get("parkingMin"),
      areaMin: form.get("areaMin"),
      currency: (form.get("currency")?.toString() as "USD"|"PEN") || "USD",
      zones
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const es: Record<string,string> = {};
      for (const issue of parsed.error.issues) es[issue.path.join(".")] = issue.message;
      setErrors(es); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/search", { method: "POST", body: JSON.stringify(parsed.data), headers: { "Content-Type": "application/json" } });
      const json = await res.json();
      window.dispatchEvent(new CustomEvent("b369:search:results", { detail: json }));
    } finally { setLoading(false); }
  }
  const errorClass = (name: string) => clsx("block w-full rounded border px-3 py-2", errors[name] ? "border-red-500" : "border-neutral-300");
  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 grid gap-3">
      <h2 className="font-semibold text-lg">Filtros</h2>
      <div><label className="text-sm">Distrito*</label><input name="district" placeholder="Miraflores" className={errorClass("district")} />{errors.district && <p className="text-xs text-red-600">{errors.district}</p>}</div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm">Dormitorios*</label><input name="bedrooms" type="number" className={errorClass("bedrooms")} />{errors.bedrooms && <p className="text-xs text-red-600">{errors.bedrooms}</p>}</div>
        <div><label className="text-sm">Precio máx.*</label><input name="priceMax" type="number" className={errorClass("priceMax")} />{errors.priceMax && <p className="text-xs text-red-600">{errors.priceMax}</p>}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm">Antigüedad máx.* (años)</label><input name="ageMax" type="number" className={errorClass("ageMax")} />{errors.ageMax && <p className="text-xs text-red-600">{errors.ageMax}</p>}</div>
        <div><label className="text-sm">Estacionamientos mín.*</label><input name="parkingMin" type="number" className={errorClass("parkingMin")} />{errors.parkingMin && <p className="text-xs text-red-600">{errors.parkingMin}</p>}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-sm">Área total mín.* (m²)</label><input name="areaMin" type="number" className={errorClass("areaMin")} />{errors.areaMin && <p className="text-xs text-red-600">{errors.areaMin}</p>}</div>
        <div><label className="text-sm">Moneda</label><select name="currency" className="block w-full rounded border px-3 py-2 border-neutral-300"><option value="USD">USD</option><option value="PEN">PEN</option></select></div>
      </div>
      <details className="mt-2"><summary className="cursor-pointer text-sm font-medium">Zonas en mapa (opcional)</summary><div className="mt-2"><MapZones onZonesChange={onZonesChange} /><p className="text-xs text-neutral-500 mt-1">Si no hay matches, se ampliará +1 km automáticamente.</p></div></details>
      <div className="flex gap-2 mt-2"><button disabled={loading} className="rounded bg-black text-white px-4 py-2">{loading ? "Buscando..." : "Buscar"}</button></div>
      <div className="text-xs text-neutral-500 mt-2">Campos obligatorios: distrito, dormitorios, precio máximo, antigüedad (años máx.), estacionamiento (mín.), área mínima.</div>
    </form>
  );
}
