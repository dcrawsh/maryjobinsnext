// app/api/alternate-titles/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const SCHEMA = "job_information";

/** 1️⃣ Look up ONET SOC codes by fuzzy-matching the title */
async function lookupOnetCodes(title: string): Promise<string[]> {
  const words = title.trim().split(/\s+/);

  // a) Full-title match
  let { data, error } = await supabase
    .schema(SCHEMA)
    .from("alternate_titles")
    .select("onet_soc_code")
    .ilike("alternate_title", `%${title}%`);
  if (error) throw error;
  if (data?.length) return data.map((r) => r.onet_soc_code);

  // b) Fallback to each word
  for (const w of words) {
    const { data: wd, error: we } = await supabase
      .schema(SCHEMA)
      .from("alternate_titles")
      .select("onet_soc_code")
      .ilike("alternate_title", `%${w}%`);
    if (we) throw we;
    if (wd?.length) return wd.map((r) => r.onet_soc_code);
  }

  return [];
}

/** 2️⃣ Fetch all alternate_title strings for those SOC codes */
async function fetchAlternateTitles(codes: string[]): Promise<string[]> {
  if (!codes.length) return [];

  const { data, error } = await supabase
    .schema(SCHEMA)
    .from("alternate_titles")
    .select("alternate_title")
    .in("onet_soc_code", codes);

  if (error) throw error;
  return (data ?? [])
    .map((r) => r.alternate_title)
    .filter((t): t is string => Boolean(t));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ titles: [] });
  }

  try {
    const codes = await lookupOnetCodes(query);
    const titles = await fetchAlternateTitles(codes);
    const uniq = Array.from(new Set(titles.map((t) => t.trim())));
    return NextResponse.json({ titles: uniq });
  } catch (err: any) {
    console.error("alternate-titles error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
