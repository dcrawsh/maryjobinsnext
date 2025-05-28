// app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary text-foreground">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="container mx-auto px-4 py-24 grid gap-12 md:grid-cols-2 items-center">
        {/* Copy block */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            MaryJobins
          </h1>
          <p className="text-xl mb-10 max-w-xl">
            AI‑powered job search assistant that curates roles, matches your
            skills, and keeps every application organized.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition"
            >
              Get Started
            </Link>
            <Link
              href="/job-search-quiz"
              className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition"
            >
              Take the Quiz
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <Image
          src="/img/main-hero.png" // swap with your own
          alt="Screenshot of MaryJobins dashboard"
          width={700}
          height={450}
          priority
          className="rounded-lg shadow-lg border mx-auto"
        />
      </header>

      {/* ── About ────────────────────────────────────────────── */}
      <section
        id="about"
        className="container mx-auto px-4 py-16 prose prose-invert prose-lg"
      >
        <h2>About MaryJobins</h2>
        <p>
          MaryJobins analyzes your résumé with AI, aggregates positions from top
          job boards, and gives you a Kanban‑style tracker to stay on top of
          every opportunity—no more endless scrolling.
        </p>
      </section>

      {/* ── Instructions ─────────────────────────────────────── */}
      <section id="instructions" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <ol className="max-w-3xl mx-auto space-y-4 list-decimal pl-6 text-lg">
          <li>Sign up and upload your résumé.</li>
          <li>Answer a short quiz to refine matching.</li>
          <li>Review your personalized job board.</li>
          <li>Track applications with our built‑in Kanban.</li>
        </ol>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>

        <Accordion
          type="single"
          collapsible
          className="max-w-2xl mx-auto divide-y divide-border"
        >
         {/* ✅ every item gets a value                         ↓↓↓↓↓ */ }
<AccordionItem value="pricing">
  <AccordionTrigger>Is MaryJobins free?</AccordionTrigger>
  <AccordionContent>
    Yes—basic features are free. Premium tiers unlock advanced AI matching and
    unlimited saved searches.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="sources">
  <AccordionTrigger>Which job boards are included?</AccordionTrigger>
  <AccordionContent>
    We currently pull from LinkedIn, Indeed, Greenhouse, Lever, and more—over 20
    sources total.
  </AccordionContent>
</AccordionItem>

<AccordionItem value="security">
  <AccordionTrigger>How do you secure my data?</AccordionTrigger>
  <AccordionContent>
    All data is encrypted in transit and at rest. We never sell or share your
    information.
  </AccordionContent>
</AccordionItem>

        </Accordion>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MaryJobins. All rights reserved.
      </footer>
    </div>
  );
}
