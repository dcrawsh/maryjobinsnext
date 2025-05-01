// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // 1) Validate Authorization header
    const authHeader = req.headers.get("authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    // 2) Retrieve the Supabase user from the token
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

    // 3) Create a Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?canceled=true`,
    });

    // 4) Return the session URL to the client
    return NextResponse.json({ url: checkoutSession.url! });
  } catch (err: any) {
    console.error("Error in /api/checkout:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
