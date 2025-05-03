// app/api/process-searches/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1) Auth header check
    const authHeader = req.headers.get("authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    // 2) Verify Supabase session
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // 3) Parse body
    const body = await req.json();
    if (!Array.isArray(body.searches)) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    // 4) Forward to your external API
    const payload = {
      user_id: user.id,
      searches: body.searches,
    };

    const externalRes = await fetch(
      "https://api.maryjobbins.com/process-searches",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!externalRes.ok) {
      console.error("External API failed:", await externalRes.text());
      return NextResponse.json(
        { error: "Failed to fetch jobs" },
        { status: 502 }
      );
    }

    const jobs = await externalRes.json();
    return NextResponse.json(jobs);
  } catch (err: any) {
    console.error("Error in /api/process-searches:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
