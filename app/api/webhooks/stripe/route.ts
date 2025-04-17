// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// init stripe with your secret
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// init supabase with service_role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const buf = await request.text();
  const sig = request.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Only handle the session completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Pull out our metadata + subscription
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string;

    if (userId && subscriptionId) {
      // update your users table: set stripe_subscription = ..., status = 'active'
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          stripe_subscription_id: subscriptionId,
          subscription_status: "active",
        })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
