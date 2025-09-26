'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import type { MapContainerProps, CircleProps } from 'react-leaflet'

// declarar dinámicos con tipos para que TS acepte center/radius
const MapContainer = dynamic<MapContainerProps>(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
)
const Circle = dynamic<CircleProps>(
  () => import('react-leaflet').then((m) => m.Circle),
  { ssr: false }
)

export default function MapZones({
  onZonesChange,
}: {
  onZonesChange: (z: any[]) => void
}) {
  const [zones, setZones] = useState<any[]>([])
  const [r, setR] = useState(1)

  useEffect(() => onZonesChange(zones), [zones])

  function add(lat: number, lng: number) {
    setZones((z) => [...z, { lat, lng, radiusKm: r }])
  }

  return (
    <div>
      <div style={{ marginBottom: 6 }}>Click en mapa para agregar radio</div>
      <div style={{ height: 260 }}>
        <MapContainer
          center={[-12.121, -77.03] as [number, number]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* MapClickHandler está definido abajo y usa require para evitar SSR */}
          <MapClickHandler onAdd={add} />
          {zones.map((z, i) => (
            <Circle
              key={i}
              center={[z.lat, z.lng] as [number, number]}
              radius={z.radiusKm * 1000}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

// MapClickHandler separado para evitar problemas con SSR/static render
function MapClickHandler({ onAdd }: { onAdd: (a: number, b: number) => void }) {
  // require dinámico — esto se ejecutará solo en cliente porque el archivo tiene 'use client'
  // así evitamos errores cuando Next haga SSR del módulo
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useMapEvents } = require('react-leaflet')
  useMapEvents({
    click(e: any) {
      onAdd(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}
