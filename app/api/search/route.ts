// app/api/search/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) || {}
    const { query } = body
    const key = body.key ?? process.env.GOOGLE_API_KEY
    const cx = body.cx ?? process.env.GOOGLE_CSE_ID
    const timeout = 5000

    if (!key || !cx) {
      return NextResponse.json(
        { results: [], alternatives: [], error: 'Faltan GOOGLE_API_KEY o GOOGLE_CSE_ID' },
        { status: 400 }
      )
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      query || ''
    )}&key=${key}&cx=${cx}`

    // Tipamos la respuesta de axios como any para evitar "unknown"
    const { data } = await axios.get<any>(url, { timeout })
    const resultsRaw: any[] = data?.items ?? []

    const results: any[] = []

    for (const item of resultsRaw) {
      // Algunas respuestas usan 'link', otras 'formattedUrl'
      const pageUrl = item.link ?? item.formattedUrl ?? item.url
      if (!pageUrl) {
        results.push({ ...item, phone: null })
        continue
      }
      try {
        const { data: html } = await axios.get<string>(pageUrl, {
          timeout,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        })
        // html es string: match está disponible
        const phone = typeof html === 'string' ? html.match(/(\+51\s?)?9\d{8}/)?.[0] ?? null : null
        results.push({ ...item, phone })
      } catch (err) {
        // si falla la descarga de la página, devuelvo item sin phone
        results.push({ ...item, phone: null })
      }
    }

    return NextResponse.json({ results, alternatives: [], filters: body })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
