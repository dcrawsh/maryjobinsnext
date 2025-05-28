// app/api/tech-tools/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const SCHEMA = "job_information";

/* ── helpers ──────────────────────────────────────────────────────────── */
const ONET_RE = /^(\d{2}-\d{4})/;           // capture “13‑1161” part

// 13‑1161.01  →  13‑1161.00
const normaliseCode = (code: string) =>
  ONET_RE.test(code) ? `${code.match(ONET_RE)![1]}.00` : code;

async function lookupOnetCodes(title: string): Promise<string[]> {
  const words = title.trim().split(/\s+/);

  // a) full‑title match
  let { data, error } = await supabase
    .schema(SCHEMA)
    .from("alternate_titles")
    .select("onet_soc_code")
    .ilike("alternate_title", `%${title}%`);
  if (error) throw error;
  if (data?.length) return data.map(r => r.onet_soc_code);

  // b) per‑word match
  for (const w of words) {
    const { data: wd, error: we } = await supabase
      .schema(SCHEMA)
      .from("alternate_titles")
      .select("onet_soc_code")
      .ilike("alternate_title", `%${w}%`);
    if (we) throw we;
    if (wd?.length) return wd.map(r => r.onet_soc_code);
  }
  return [];
}

async function fetchTechTools(codes: string[]) {
  // ❶ strip duplicates and normalise to *.00
  const unique = Array.from(new Set(codes.map(normaliseCode)));

  const { data, error } = await supabase
    .schema(SCHEMA)
    .from("tools_and_technology")
    .select("onet_soc_code, t2_example, t2_type")
    .in("onet_soc_code", unique);

  if (error) throw error;

  return (data ?? [])
    .filter(r => r.t2_type === "Technology")
    .map(r => ({ code: r.onet_soc_code, name: r.t2_example.trim() }))
    .filter((t, i, all) => all.findIndex(x => x.name === t.name) === i); // dedupe by name
}

/* ── route ─────────────────────────────────────────────────────────────── */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const titleParam = searchParams.get("title")?.trim() ?? "";
  const rawAltParam = searchParams.get("codes") ?? "";

  // Caller can pass either alt‑titles *or* raw codes here
  const alternates = rawAltParam
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  let tools: { code: string; name: string }[] = [];

  /* 1️⃣ primary title */
  if (titleParam) {
    const codes = await lookupOnetCodes(titleParam);
    tools = await fetchTechTools(codes);
  }

  /* 2️⃣ fall‑back: walk each alternate until we get tools               */
  if (tools.length === 0 && alternates.length) {
    for (const alt of alternates) {
      const codes = ONET_RE.test(alt)        // already a code?
        ? [alt]
        : await lookupOnetCodes(alt);        // else look it up
      if (!codes.length) continue;

      tools = await fetchTechTools(codes);
      if (tools.length) break;               // stop on first hit
    }
  }

  return NextResponse.json({ tools });
}
