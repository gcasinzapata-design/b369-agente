// components/Chat.tsx
"use client";
import { useEffect, useState } from "react";

export default function Chat() {
  const [results, setResults] = useState<any[]>([]);
  const [alternatives, setAlternatives] = useState<any[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      setResults(e.detail.results || []);
      setAlternatives(e.detail.alternatives || []);
    };
    window.addEventListener("b369:search:results", handler);
    return () => window.removeEventListener("b369:search:results", handler);
  }, []);

  return (
    <div style={{ background: "#fafafa", padding: 12, borderRadius: 8, height: 600, overflow: "auto" }}>
      <h3>Resultados</h3>
      {results.map((r, i) => (
        <div key={i} style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
          <a href={r.url} target="_blank" rel="noreferrer"><strong>{r.title}</strong></a>
          <div style={{ fontSize: 12, color: "#666" }}>{r.source}</div>
          {r.price && <div>Precio: {r.price}</div>}
          {r.contactPhone && <div>Contacto: {r.contactPhone}</div>}
        </div>
      ))}
      {alternatives.length > 0 && (
        <div>
          <h4>Alternativas</h4>
          {alternatives.map((a, i) => <div key={i}>{a.title}</div>)}
        </div>
      )}
    </div>
  );
}
