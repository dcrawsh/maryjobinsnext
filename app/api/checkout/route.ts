import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const {
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_ID,
    NEXT_PUBLIC_APP_URL,
  } = process.env;

  const missing = [
    !NEXT_PUBLIC_SUPABASE_URL && "NEXT_PUBLIC_SUPABASE_URL",
    !SUPABASE_SERVICE_ROLE_KEY && "SUPABASE_SERVICE_ROLE_KEY",
    !STRIPE_SECRET_KEY && "STRIPE_SECRET_KEY",
    !NEXT_PUBLIC_STRIPE_PRICE_ID && "NEXT_PUBLIC_STRIPE_PRICE_ID",
    !NEXT_PUBLIC_APP_URL && "NEXT_PUBLIC_APP_URL",
  ].filter(Boolean);

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing env vars: ${missing.join(", ")}` },
      { status: 500 }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
  });

  const supabaseAdmin = createClient(
    NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or malformed Authorization header" },
        { status: 401 }
      );
    }
    const token = auth.replace("Bearer ", "");

    const {
      data: { user },
      error: userErr,
    } = await supabaseAdmin.auth.getUser(token);

    if (userErr) throw new Error(`Supabase getUser error: ${userErr.message}`);
    if (!user) {
      return NextResponse.json(
        { error: "No Supabase user for that token" },
        { status: 401 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: NEXT_PUBLIC_STRIPE_PRICE_ID!, quantity: 1 }],
      metadata: { userId: user.id },
      success_url: `${NEXT_PUBLIC_APP_URL}/subscribe?success=true`,
      cancel_url: `${NEXT_PUBLIC_APP_URL}/subscribe?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("🔥 /api/checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
