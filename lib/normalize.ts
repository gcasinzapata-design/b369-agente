export function normalizeItem(item:any){return {title:item.title||"Propiedad",url:item.link,source:new URL(item.link).hostname,summary:item.snippet};}
export function dedupe(list:any[]){const seen=new Set();return list.filter(x=>{if(seen.has(x.url))return false;seen.add(x.url);return true;});}
export function priceWithin(t:string|undefined,min:number|undefined,max:number|undefined){return true;}
