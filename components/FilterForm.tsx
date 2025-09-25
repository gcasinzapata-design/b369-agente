// components/FilterForm.tsx
"use client";
import { useState } from "react";

export default function FilterForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const payload = {
      district: fd.get("district")?.toString() || "",
      bedrooms: Number(fd.get("bedrooms") || 0),
      priceMax: Number(fd.get("priceMax") || 0),
      ageMax: Number(fd.get("ageMax") || 0),
      parkingMin: Number(fd.get("parkingMin") || 0),
      areaMin: Number(fd.get("areaMin") || 0),
      zones: []
    };
    const res = await fetch("/api/search", { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } });
    const json = await res.json();
    window.dispatchEvent(new CustomEvent("b369:search:results", { detail: json }));
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
      <h3>Filtros</h3>
      <div><label>Distrito*</label><input name="district" defaultValue="Miraflores" /></div>
      <div><label>Dormitorios*</label><input name="bedrooms" type="number" defaultValue={3} /></div>
      <div><label>Precio máx*</label><input name="priceMax" type="number" defaultValue={250000} /></div>
      <div><label>Antigüedad máx*</label><input name="ageMax" type="number" defaultValue={10} /></div>
      <div><label>Estacionamientos mín*</label><input name="parkingMin" type="number" defaultValue={1} /></div>
      <div><label>Área mín*</label><input name="areaMin" type="number" defaultValue={80} /></div>
      <div style={{marginTop:8}}><button type="submit" disabled={loading}>{loading ? "Buscando..." : "Buscar"}</button></div>
    </form>
  );
}
