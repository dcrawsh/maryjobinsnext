import { createClient } from "npm:@supabase/supabase-js@2.39.8";
import express from "npm:express@4.18.2";
import { z } from "npm:zod@3.22.4";

const app = express();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Schema for job search parameters
const searchParamsSchema = z.object({
  job_title: z.string(),
  years_of_experience: z.string(),
  location: z.string(),
  skill_level: z.string(),
  remote_preference: z.string(),
});

// Mock job data - in production this would come from a real job database
const mockJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Corp",
    location: "New York, NY",
    salary: "$150,000 - $180,000",
    description: "Looking for an experienced software engineer...",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "StartupCo",
    location: "Remote",
    salary: "$120,000 - $150,000",
    description: "Join our fast-growing team...",
  },
  // Add more mock jobs here
];

app.use(express.json());

app.post("/search-jobs", async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Validate search parameters
    const searchParams = searchParamsSchema.parse(req.body);

    // Get user's subscription status
    const { data: { user } } = await supabase.auth.getUser(
      req.headers.authorization?.split(" ")[1] ?? ""
    );

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get user's profile to check subscription status
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    // Filter jobs based on search parameters
    // In production, this would be a real search algorithm
    const filteredJobs = mockJobs.filter(job => 
      job.title.toLowerCase().includes(searchParams.job_title.toLowerCase())
    );

    // Return limited results for free users
    const isSubscriber = profile?.subscription_status === "premium";
    const results = isSubscriber ? filteredJobs : filteredJobs.slice(0, 3);

    res.json({
      jobs: results,
      total: filteredJobs.length,
      limited: !isSubscriber,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(8000);