type Result = { title: string; url: string; source: string; price?: string; location?: string; summary?: string; contactName?: string; contactPhone?: string; score?: number; };
export default function ResultCard({ r }: { r: Result }) {
  return (
    <div className="border rounded p-3 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {r.title} <span className="text-xs text-neutral-500">• {r.source}</span>
          {typeof r.score === "number" && r.score >= 0.95 ? <span className="ml-2 text-[10px] px-2 py-1 rounded bg-green-600 text-white">Match 95%</span> : null}
        </h3>
        <a href={r.url} target="_blank" className="text-sm underline">Abrir</a>
      </div>
      {r.price && <p className="text-sm mt-1"><strong>Precio:</strong> {r.price}</p>}
      {typeof r.score === "number" ? (
        <div className="mt-1">
          <div className="h-1.5 bg-neutral-200 rounded"><div className="h-1.5 bg-black rounded" style={{ width: `${Math.round(r.score*100)}%` }} /></div>
          <div className="text-[10px] text-neutral-500 mt-1">{Math.round(r.score*100)}%</div>
        </div>
      ) : null}
      {r.location && <p className="text-sm"><strong>Ubicación:</strong> {r.location}</p>}
      {r.summary && <p className="text-sm mt-1">{r.summary}</p>}
      <div className="text-sm mt-2"><strong>Contacto:</strong> {r.contactName ?? "—"} {r.contactPhone ? `— ${r.contactPhone}` : ""}</div>
    </div>
  );
}
