"use client";
import { useEffect, useRef, useState } from "react";
import ResultCard from "./ResultCard";
type Msg = { role: "user"|"assistant"|"system"; content: string };
type SearchPayload = { results: any[]; filters: any; alternatives?: any[] };
export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: "Hola 👋 Soy el agente interno B369. Completa los filtros y presiona Buscar." }]);
  const [results, setResults] = useState<any[]>([]);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: any) => {
      const payload: SearchPayload = e.detail;
      setResults(payload.results || []);
      setAlternatives(payload.alternatives || []);
      setMessages(m => [...m, { role: "assistant", content: `Encontré ${payload.results?.length ?? 0} coincidencias y ${payload.alternatives?.length ?? 0} alternativas.` }]);
    };
    window.addEventListener("b369:search:results", handler);
    return () => window.removeEventListener("b369:search:results", handler);
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, results, alternatives]);
  return (
    <div className="grid gap-4">
      <div className="border rounded bg-white p-3 h-[520px] overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "mb-3" : "mb-3 text-right"}>
            <div className={m.role === "assistant" ? "inline-block bg-neutral-100 px-3 py-2 rounded" : "inline-block bg-black text-white px-3 py-2 rounded"}>
              {m.content}
            </div>
          </div>
        ))}
        <div className="mt-4 grid gap-3">{results.map((r, idx) => <ResultCard key={idx} r={r} />)}</div>
        {alternatives.length ? (<div className="mt-6"><h4 className="font-semibold mb-2">Alternativas sugeridas</h4><div className="grid gap-3">{alternatives.map((r, idx) => <ResultCard key={`alt-${idx}`} r={r} />)}</div></div>) : null}
        <div ref={endRef} />
      </div>
    </div>
  );
}
