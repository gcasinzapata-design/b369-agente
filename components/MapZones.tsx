"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(m => m.Circle), { ssr: false });
const useMapEvents = dynamic(() => import("react-leaflet").then(m => m.useMapEvents), { ssr: false });
type Zone = { lat: number; lng: number; radiusKm: number };
function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  // @ts-ignore
  useMapEvents({ click(e) { onClick(e.latlng.lat, e.latlng.lng); } });
  return null;
}
export default function MapZones({ onZonesChange }: { onZonesChange: (zones: Zone[]) => void }) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [radiusKm, setRadiusKm] = useState<number>(1.0);
  useEffect(() => { onZonesChange(zones); }, [zones, onZonesChange]);
  const addPoint = (lat: number, lng: number) => setZones(z => [...z, { lat, lng, radiusKm }]);
  const removeZone = (idx: number) => setZones(z => z.filter((_, i) => i !== idx));
  const updateRadius = (idx: number, r: number) => setZones(z => z.map((zz, i) => i === idx ? { ...zz, radiusKm: r } : zz));
  return (
    <div className="grid gap-2">
      <div className="text-sm">Haz click en el mapa para añadir un <strong>radio</strong>.</div>
      <div className="grid grid-cols-2 gap-2 items-center">
        <label className="text-sm">Radio por defecto (km)</label>
        <input type="number" step="0.5" min="0.5" value={radiusKm} onChange={e => setRadiusKm(parseFloat(e.target.value || "1"))} className="border rounded px-2 py-1" />
      </div>
      <div style={{ height: 260 }} className="border rounded overflow-hidden">
        <MapContainer center={[-12.121, -77.03]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onClick={addPoint} />
          {zones.map((z, i) => (<Circle key={i} center={[z.lat, z.lng]} radius={z.radiusKm * 1000} pathOptions={{ color: "#111" }} />))}
        </MapContainer>
      </div>
      {zones.length ? (
        <div className="text-sm">
          <div className="font-medium mb-1">Zonas</div>
          <div className="grid gap-1">
            {zones.map((z, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-xs grow">#{i+1}: {z.lat.toFixed(5)}, {z.lng.toFixed(5)} • {z.radiusKm} km</div>
                <input type="number" step="0.5" value={z.radiusKm} onChange={e => updateRadius(i, parseFloat(e.target.value || "1"))} className="border rounded px-2 py-1 w-24 text-xs" />
                <button onClick={() => removeZone(i)} className="text-xs px-2 py-1 border rounded">Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
