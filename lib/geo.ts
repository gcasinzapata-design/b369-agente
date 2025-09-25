// lib/geo.ts
export function haversineKm(a: {lat:number;lng:number}, b:{lat:number;lng:number}) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI/180;
  const dLng = (b.lng - a.lng) * Math.PI/180;
  const lat1 = a.lat * Math.PI/180;
  const lat2 = b.lat * Math.PI/180;
  const sinDLat = Math.sin(dLat/2);
  const sinDLng = Math.sin(dLng/2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat*sinDLat + Math.cos(lat1)*Math.cos(lat2)*sinDLng*sinDLng));
  return R * c;
}

export async function geocodeDistrictCentroid(district: string): Promise<{lat:number;lng:number}|null> {
  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY;
  const query = encodeURIComponent(`${district}, Lima, Peru`);
  if (key) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${key}`;
      const res = await fetch(url, { next: { revalidate: 60 } });
      const json = await res.json();
      const loc = json.results?.[0]?.geometry?.location;
      if (loc) return { lat: loc.lat, lng: loc.lng };
    } catch {}
  }
  const hints: Record<string,{lat:number;lng:number}> = {
    "miraflores": { lat: -12.1211, lng: -77.0301 },
    "san isidro": { lat: -12.0999, lng: -77.0365 },
    "barranco": { lat: -12.1527, lng: -77.0219 },
    "magdalena": { lat: -12.0907, lng: -77.0804 },
    "surco": { lat: -12.1455, lng: -76.9901 },
    "san borja": { lat: -12.1064, lng: -76.9970 },
    "lince": { lat: -12.0922, lng: -77.0350 }
  };
  const h = hints[district.toLowerCase()];
  return h || null;
}
