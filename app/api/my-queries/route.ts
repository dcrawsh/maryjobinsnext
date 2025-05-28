// app/api/my-queries/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'public' } }
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  if (!user_id) {
    return NextResponse.json({ queries: [] })
  }

  const { data, error } = await supabase
    .from('job_searches')
    .select('queries')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  // either use the real array or parse the JSON text
  const raw = data?.queries
  const queries: string[] = Array.isArray(raw)
    ? raw
    : raw
    ? JSON.parse(raw as string)
    : []

  return NextResponse.json({ queries })
}
