export function normalizeItem(item: any) {
  const link = item.link || item.url;
  return {
    title: item.title?.trim() || item.htmlTitle || "Propiedad",
    url: link,
    source: extractSource(link),
    price: extractPrice(item.snippet || item.pagemap?.metatags?.[0]?.description),
    location: extractLocation(item.snippet || ""),
    summary: cleanSnippet(item.snippet || ""),
    publishedAt: undefined,
    features: extractFeatures(item.snippet || "")
  };
}

export function dedupe(list: any[]) {
  const seen = new Set<string>();
  return list.filter(x => {
    const key = (x.url || "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractSource(url: string) {
  try { return new URL(url).hostname.replace("www.",""); } catch { return "fuente"; }
}
function extractPrice(text?: string) {
  if (!text) return undefined;
  const m = text.match(/(?:USD|\$|S\/\.?|S\/)\s?[\d.,]+/i);
  return m ? m[0].replace("S/.", "S/") : undefined;
}
function extractLocation(text: string) {
  const m = text.match(/(Miraflores|San Isidro|Barranco|Surco|Magdalena|San Borja|Lince)/i);
  return m?.[0];
}
function extractFeatures(text: string) {
  const feats: string[] = [];
  if (/balc[oó]n/i.test(text)) feats.push("Balcón");
  if (/vista al mar/i.test(text)) feats.push("Vista al mar");
  if (/cochera|estacionamiento/i.test(text)) feats.push("Cochera");
  return feats;
}
function cleanSnippet(s: string) { return s.replace(/\s+/g, " ").trim(); }

export function priceWithin(textPrice: string|undefined, min: number|undefined, max: number|undefined, tol = 0.02) {
  if (!textPrice) return true;
  const num = Number(textPrice.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return true;
  if (min != null && num < min*(1-tol)) return false;
  if (max != null && num > max*(1+tol)) return false;
  return true;
}
