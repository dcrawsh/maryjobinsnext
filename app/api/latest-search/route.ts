// app/api/latest-search/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← only on the server
);
const SCHEMA = 'public'; // or "job_information" if that's where the table lives

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) return NextResponse.json({ data: null });

  const { data, error } = await supabase
    .schema(SCHEMA)
    .from('job_searches')
    .select(
      'job_title, years_of_experience, location, skill_level, remote_preference, resume_data, alternate_titles, tech_skills'
    )
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return NextResponse.json({ data: null });

  // parse JSON column(s) that come back as strings
  return NextResponse.json({
    data: {
      ...data,
      alternate_titles: safeJson(data.alternate_titles),
      tech_skills:     safeJson(data.tech_skills),   // ← add this line
    },
  });
}

function safeJson(value: any) {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return [];
  }
}
