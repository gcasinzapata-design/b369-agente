// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, key = process.env.GOOGLE_API_KEY, cx = process.env.GOOGLE_CSE_ID } = body
    const timeout = 5000

    if (!key || !cx) {
      return NextResponse.json(
        { results: [], alternatives: [], error: 'Faltan GOOGLE_API_KEY o GOOGLE_CSE_ID' },
        { status: 400 }
      )
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${key}&cx=${cx}`

    const { data } = await axios.get<{ items?: any[] }>(url, { timeout })
    const resultsRaw = data.items || []

    const results: any[] = []
    for (const item of resultsRaw) {
      const { data: html } = await axios.get<string>(item.link, {
        timeout,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      const phone = html.match(/(\+51\s?)?9\d{8}/)?.[0]
      results.push({ ...item, phone })
    }

    return NextResponse.json({ results, alternatives: [], filters: body })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
