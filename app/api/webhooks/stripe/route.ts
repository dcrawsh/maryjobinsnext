import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_SIGNING_SECRET!
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  console.log("🔔 Stripe event:", event.type, event.id);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("🔔 Session:", session);

    const userId = session.metadata?.userId;
    const customerId = session.customer as string;

    if (userId) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "active",
          stripe_customer_id: customerId,
        })
        .eq("id", userId);

      console.log("🔔 Supabase update result:", { data, error });
      if (error) {
        console.error("❌ Supabase update error:", error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    } else {
      console.warn("⚠️ No userId in session metadata – skipping DB write");
    }
  }

  return NextResponse.json({ received: true });
}
