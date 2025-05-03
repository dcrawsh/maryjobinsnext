"use client";

import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SubscribeCard() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const handleClick = async () => {
    if (!session) return;
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setLoading(false);
      return alert(`Error starting checkout:\n${body.error || res.statusText}`);
    }

    const { url } = await res.json();
    window.location.assign(url);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Subscribe</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">Unlock premium access – $5/week.</p>
        <Button className="w-full" onClick={handleClick} disabled={loading}>
          {loading ? "Redirecting…" : "Subscribe Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
