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
            Job search done different.
          </h1>
          <p className="text-xl mb-10 max-w-xl">
            MaryJobins is job search built for workers.
          </p>

          <div className="flex justify-center md:justify-start gap-4">
            <Link
              href="/job-search-quiz"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition"
            >
              Try our free quiz
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

      {/* ── Section Two: Mission ────────────────────────────── */}
      <section className="container mx-auto px-4 py-16 grid gap-12 md:grid-cols-2 items-center">
        <div>
        <h2 className="text-3xl font-bold mb-6">
  At MaryJobins, we<br />
  create tools that breathe<br />
  fresh air into job searching
</h2>
        </div>
        <div className="rounded-lg text-">
          <p className="text-left">We believe job search is broken. Employers are aggregating vast data on workers to make hiring decisions, job aggregators create two sided markets or social media platforms designed to sell to job searchers.
          </p>
          <br/>
          <p className="text-left">
          That’s why we create tools to benefit job searchers. Delight can come least when you expect it, and we hope that our first tool makes just one person’s job search a bit brighter.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="container mx-auto px-4 py-16">
  <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
  
  <div className="max-w-6xl mx-auto space-y-12">
    {/* Step 1: Sign Up */}
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="md:w-1/2">
        <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <span className="text-blue-600 font-bold text-xl">1</span>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Sign Up</h3>
        <p className="text-lg text-gray-600 mb-4">
          Create your account in seconds. Just provide your name, email, and password to get started.
        </p>
        <a 
          href="https://maryjobins.com/auth" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started →
        </a>
      </div>
      <div className="md:w-1/2">
        <img 
          src="/screenshots/how-it-works/01-signup-form.png" 
          alt="MaryJobins signup form"
          className="rounded-lg shadow-lg w-full"
        />
      </div>
    </div>

    {/* Step 2: Take Quiz */}
    <div className="flex flex-col md:flex-row-reverse items-center gap-8">
      <div className="md:w-1/2">
        <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <span className="text-green-600 font-bold text-xl">2</span>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Take the Quiz</h3>
        <p className="text-lg text-gray-600">
          Tell us about your ideal role and preferences. Our smart matching algorithm will use this to find the perfect jobs for you.
        </p>
      </div>
      <div className="md:w-1/2">
        <img 
          src="/screenshots/how-it-works/02-job-quiz.png" 
          alt="Job search quiz interface"
          className="rounded-lg shadow-lg w-full"
        />
      </div>
    </div>

    {/* Step 3: Quiz Completion */}
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="md:w-1/2">
        <div className="bg-purple-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <span className="text-purple-600 font-bold text-xl">3</span>
        </div>
        <h3 className="text-2xl font-semibold mb-4">You're All Set!</h3>
        <p className="text-lg text-gray-600">
          Congratulations! Your job search is now active. We'll start finding and curating jobs that match your preferences.
        </p>
      </div>
      <div className="md:w-1/2">
        <img 
          src="/screenshots/how-it-works/03-quiz-completion-congrats.png" 
          alt="Quiz completion congratulations"
          className="rounded-lg shadow-lg w-full"
        />
      </div>
    </div>

    {/* Step 4: Jobs Flow In */}
    <div className="flex flex-col md:flex-row-reverse items-center gap-8">
      <div className="md:w-1/2">
        <div className="bg-orange-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <span className="text-orange-600 font-bold text-xl">4</span>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Jobs Start Flowing In!</h3>
        <p className="text-lg text-gray-600">
          Watch as personalized job opportunities appear in your dashboard. Keep an eye out for new matches – we're constantly finding jobs that fit your profile.
        </p>
      </div>
      <div className="md:w-1/2">
        <img 
          src="/screenshots/how-it-works/04-job-listings-detailed-view.png" 
          alt="Job listings in detailed view"
          className="rounded-lg shadow-lg w-full"
        />
      </div>
    </div>

    {/* Step 5: Save or Trash */}
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="md:w-1/2">
        <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <span className="text-red-600 font-bold text-xl">5</span>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Save or Trash Jobs</h3>
        <p className="text-lg text-gray-600">
          Quickly organize your opportunities in our intuitive list view. Save jobs you're interested in, mark others as not relevant, and keep your pipeline clean.
        </p>
      </div>
      <div className="md:w-1/2">
        <img 
          src="/screenshots/how-it-works/05-job-listings-kanban-view.png" 
          alt="Job listings in Kanban list view"
          className="rounded-lg shadow-lg w-full"
        />
      </div>
    </div>

    {/* Step 6: Track with Kanban */}
    <div className="flex flex-col md:flex-row-reverse items-center gap-8">
      <div className="md:w-1/2">
        <div className="bg-indigo-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          <span className="text-indigo-600 font-bold text-xl">6</span>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Track Applications with Kanban</h3>
        <p className="text-lg text-gray-600">
          Switch to our built-in Kanban view to track your application progress. Move jobs through different stages from "New" to "Applied" and beyond.
        </p>
      </div>
      <div className="md:w-1/2">
        <div className="bg-gray-100 rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-500 italic">Kanban tracking view screenshot</p>
          <small className="text-gray-400">(Use the same image as step 5, or capture a different Kanban view if available)</small>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>

        <Accordion
          type="single"
          collapsible
          className="max-w-2xl mx-auto divide-y divide-border"
        >
          <AccordionItem value="pricing">
            <AccordionTrigger>Is MaryJobins free?</AccordionTrigger>
            <AccordionContent>
              Yes—basic features are free. Premium tiers unlock advanced AI matching and
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
              All data is encrypted in transit and at rest. We never sell or share your
              information.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="team">
            <AccordionTrigger>Who built MaryJobins?</AccordionTrigger>
            <AccordionContent>
              MaryJobins was built by a team of developers and job search experts who 
              experienced the frustrations of traditional job hunting firsthand.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── Coming Soon Tiles Gallery ───────────────────────── */}
      <section id="coming-soon" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Coming Soon</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* Blog Post 1 */}
          <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-3">
              Blog Post
            </div>
            <h3 className="text-lg font-semibold mb-4 line-clamp-2">
              Introducing MaryJobins: Your Super-Efficient Job Search Assistant
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Introduction to MaryJobins</li>
              <li>• Platform features overview</li>
              <li>• Mary Poppins-inspired approach</li>
              <li>• How MaryJobins streamlines job searching</li>
            </ul>
          </div>

          {/* Blog Post 2 */}
          <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-3">
              Blog Post
            </div>
            <h3 className="text-lg font-semibold mb-4 line-clamp-2">
              Mastering the Art of the Job Search: Tips and Tricks from MaryJobins
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Job search best practices</li>
              <li>• Using MaryJobins effectively</li>
              <li>• Organization tips</li>
              <li>• Job search productivity hacks</li>
            </ul>
          </div>

          {/* Blog Post 3 */}
          <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-3">
              Blog Post
            </div>
            <h3 className="text-lg font-semibold mb-4 line-clamp-2">
              The Mary Poppins Approach to Job Hunting: Organized, Empowered, and Successful
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Mary Poppins methodology</li>
              <li>• Bringing order to chaos</li>
              <li>• Empowerment through organization</li>
              <li>• Success stories</li>
            </ul>
          </div>

          {/* Blog Post 4 */}
          <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-3">
              Blog Post
            </div>
            <h3 className="text-lg font-semibold mb-4 line-clamp-2">
              Unlock Your Potential: How MaryJobins Helps You Land Your Dream Job
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Finding the perfect job match</li>
              <li>• Leveraging MaryJobins features</li>
              <li>• Success stories</li>
              <li>• Taking action towards dream jobs</li>
            </ul>
          </div>

          {/* Blog Post 5 */}
          <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-3">
              Blog Post
            </div>
            <h3 className="text-lg font-semibold mb-4 line-clamp-2">
              Real-Time Job Streaming: Never Miss an Opportunity with MaryJobins
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Streaming job results feature</li>
              <li>• Real-time notifications</li>
              <li>• Staying ahead of the competition</li>
              <li>• Quick application process</li>
            </ul>
          </div>

          {/* Blog Post 6 */}
          <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-3">
              Blog Post
            </div>
            <h3 className="text-lg font-semibold mb-4 line-clamp-2">
              From Chaos to Clarity: Organize Your Job Applications with MaryJobins' Kanban Board
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Kanban board tutorial</li>
              <li>• Application status tracking</li>
              <li>• Organizing job search workflow</li>
              <li>• Reducing job search stress</li>
            </ul>
          </div>

          {/* Blog Post 7 */}
          <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-3">
              Blog Post
            </div>
            <h3 className="text-lg font-semibold mb-4 line-clamp-2">
              Remote Work Revolution: How to Find and Land Remote Jobs Using MaryJobins
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Remote work trend</li>
              <li>• Using the remote toggle feature</li>
              <li>• Finding quality remote positions</li>
              <li>• Remote job application tips</li>
            </ul>
          </div>

          {/* Blog Post 8 */}
          <div className="bg-card rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-3">
              Blog Post
            </div>
            <h3 className="text-lg font-semibold mb-4 line-clamp-2">
              Looking Ahead: The Future of Job Searching with MaryJobins
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Upcoming features preview</li>
              <li>• Beta roadmap</li>
              <li>• Automatic query generation teaser</li>
              <li>• Community success stories</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MaryJobins. All rights reserved.
      </footer>
    </div>
  );
}
