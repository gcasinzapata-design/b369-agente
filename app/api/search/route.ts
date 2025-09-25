import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { buildQueries, TARGET_SITES } from "../../../lib/providers";
import { dedupe, normalizeItem, priceWithin } from "../../../lib/normalize";
import { haversineKm, geocodeDistrictCentroid } from "../../../lib/geo";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const q = buildQueries(body);
    const key = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CSE_ID;
    const timeout = Number(process.env.FETCH_TIMEOUT_MS || 10000);

    if (!key || !cx) {
      return NextResponse.json({
        results: [],
        alternatives: [],
        error: "Faltan GOOGLE_API_KEY o GOOGLE_CSE_ID",
      });
    }

    const resultsRaw: any[] = [];
    for (const query of q) {
      try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${encodeURIComponent(
          query
        )}&num=8`;
        const { data } = await axios.get(url, { timeout });
        resultsRaw.push(...(data.items || []));
      } catch {
        continue;
      }
    }

    let norm = dedupe(resultsRaw.map(normalizeItem));
    const centroid = await geocodeDistrictCentroid(body.district || "");

    const enriched: any[] = [];
    for (const item of norm.slice(0, 40)) {
      try {
        const { data: html } = await axios.get(item.url, {
          timeout,
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        const phone = html.match(/(\+51\s?)?9\d{8}/)?.[0];
        enriched.push({
          ...item,
          contactPhone: phone,
          lat: centroid?.lat,
          lng: centroid?.lng,
        });
      } catch {
        enriched.push({ ...item, lat: centroid?.lat, lng: centroid?.lng });
      }
    }

    const results = enriched.slice(0, 10);
    const alternatives = enriched
      .slice(10, 20)
      .map((r) => ({
        ...r,
        summary: (r.summary || "") + " (alternativa)",
      }));

    return NextResponse.json({ results, alternatives, filters: body });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
