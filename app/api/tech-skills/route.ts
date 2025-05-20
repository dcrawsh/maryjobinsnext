// app/api/tech-tools/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const SCHEMA = "job_information";

async function lookupOnetCodes(title: string): Promise<string[]> {
  const words = title.trim().split(/\s+/);

  // a) Full‐title match against alternate_titles
  let { data, error } = await supabase
    .schema(SCHEMA)
    .from("alternate_titles")
    .select("onet_soc_code")
    .ilike("alternate_title", `%${title}%`);
  if (error) throw error;
  if (data?.length) return data.map((r) => r.onet_soc_code);

  // b) Fallback per word
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

/** 2️⃣ Fetch only the “Tools” examples by SOC code */
async function fetchTechTools(
  codes: string[]
): Promise<{ code: string; name: string }[]> {
  if (!codes.length) return [];

  const { data, error } = await supabase
    .schema(SCHEMA)
    .from("tools_and_technology")
    .select("onet_soc_code, t2_example")
    .eq("t2_type", "Technology")
    .in("onet_soc_code", codes)
    .limit(100);

  if (error) throw error;

  // Dedupe by the example name
  const seen = new Set<string>();
  return (data ?? [])
    .map((r) => ({
      code: r.onet_soc_code,
      name: r.t2_example.trim(),
    }))
    .filter((tool) => {
      if (seen.has(tool.name)) return false;
      seen.add(tool.name);
      return true;
    });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const titleParam = searchParams.get("title")?.trim() ?? "";
  const codesParam = searchParams.get("codes") ?? "";

  // parse SOC codes if provided
  let codes = codesParam
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  // 1) try fetching tools for supplied codes
  let tools = await fetchTechTools(codes);

  // 2) fallback on title if no tools or no codes
  if ((!tools.length || !codes.length) && titleParam) {
    const fallbackCodes = await lookupOnetCodes(titleParam);
    tools = await fetchTechTools(fallbackCodes);
  }

  return NextResponse.json({ tools });
}
