// app/subscribe/page.tsx
import Stripe from "stripe";
import SubscribeCard from "./SubscribeCard";
import { createClient } from "../utils/supabase/server";


// ensure Next.js treats this as dynamic (no caching)
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});



export default async function SubscribePage() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  console.log("Supabase client created:", data);
  // create a new Checkout Session on every request
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!, quantity: 1 }],
    metadata: {
      userId: "", // Replace with actual user ID
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <SubscribeCard sessionUrl={session.url!} />
    </div>
  );
}
