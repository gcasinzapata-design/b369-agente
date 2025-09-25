export default function ResultCard({r}:{r:any}){
  return (<div style={{border:'1px solid #eee',padding:12,borderRadius:8,background:'#fff',marginBottom:8}}>
    <div style={{display:'flex',justifyContent:'space-between'}}>
      <div><strong>{r.title}</strong><div style={{fontSize:12,color:'#6b7280'}}>{r.source}</div></div>
      <a href={r.url} target="_blank" rel="noreferrer">Abrir</a>
    </div>
    {r.price && <div style={{marginTop:6}}>Precio: {r.price}</div>}
    {r.summary && <div style={{marginTop:6}}>{r.summary}</div>}
    <div style={{marginTop:6,fontSize:13}}>Contacto: {r.contactName||'—'} {r.contactPhone||''}</div>
  </div>);
}
