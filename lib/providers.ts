export const TARGET_SITES = [
  "urbania.pe",
  "adondevivir.com",
  "properati.pe",
  "babilonia.pe",
  "laencontre.com.pe",
  "olx.com.pe/inmuebles"
];

export function buildQueries(filters: any) {
  const words = [
    `"${filters.bedrooms} dormitorios"`,
    filters.bathrooms ? `"${filters.bathrooms} baños"` : "",
    filters.balcony ? `"balcón"` : "",
    filters.view === "mar" ? `"vista al mar"` : filters.view === "parque" ? `"vista parque"` : "",
    `"${filters.district}"`
  ].filter(Boolean).join(" ");

  const base = `${words}`.trim();
  return TARGET_SITES.map(site => `site:${site} ${base}`).concat([`${base} departamento venta alquiler Lima`]);
}
