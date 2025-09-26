'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// imports dinámicos
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((m) => m.Circle),
  { ssr: false }
);

export default function MapZones({
  onZonesChange,
}: {
  onZonesChange: (z: any[]) => void;
}) {
  const [zones, setZones] = useState<any[]>([]);
  const [r, setR] = useState(1);

  useEffect(() => onZonesChange(zones), [zones]);

  function add(lat: number, lng: number) {
    setZones((z) => [...z, { lat, lng, radiusKm: r }]);
  }

  return (
    <div>
      <div style={{ marginBottom: 6 }}>Click en mapa para agregar radio</div>
      <div style={{ height: 260 }}>
        <MapContainer
          center={[-12.121, -77.03] as [number, number]} // casteo
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* @ts-ignore */}
          <MapClickHandler onAdd={add} />
          {zones.map((z, i) => (
            <Circle
              key={i}
              center={[z.lat, z.lng] as [number, number]} // casteo
              radius={z.radiusKm * 1000} // radius sí existe
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

// MapClickHandler separado para evitar errores con dynamic
function MapClickHandler({ onAdd }: { onAdd: (a: number, b: number) => void }) {
  const { useMapEvents } = require('react-leaflet'); // evitar SSR issues
  useMapEvents({
    click(e: any) {
      onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
