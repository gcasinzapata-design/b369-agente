// app/api/search/route.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, key = process.env.GOOGLE_API_KEY, cx = process.env.GOOGLE_CSE_ID } = body || {}
    const timeout = 5000

    if (!key || !cx) {
      return NextResponse.json(
        { results: [], alternatives: [], error: 'Faltan GOOGLE_API_KEY o GOOGLE_CSE_ID' },
        { status: 400 }
      )
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${key}&cx=${cx}`

    const { data } = await axios.get<{ items?: any[] }>(url, { timeout })
    const resultsRaw = data?.items ?? []

    const results: any[] = []
    for (const item of resultsRaw) {
      // algunos items usan 'link' y otros 'formattedUrl' según la respuesta
      const pageUrl = item.link ?? item.formattedUrl ?? item.url
      if (!pageUrl) { results.push(item); continue; }

      try {
        const { data: html } = await axios.get<string>(pageUrl, {
          timeout,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        })
        const phone = html.match(/(\+51\s?)?9\d{8}/)?.[0] ?? null
        results.push({ ...item, phone })
      } catch (e) {
        results.push({ ...item, phone: null })
      }
    }

    return NextResponse.json({ results, alternatives: [], filters: body })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
