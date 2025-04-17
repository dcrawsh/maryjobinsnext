"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  sessionUrl: string;
}

export default function SubscribeCard({ sessionUrl }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    window.location.assign(sessionUrl);
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
