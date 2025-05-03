'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabaseBrowser';

interface Job {
  job_id: string;
  title: string;
  company_name: string;
  location?: string;
  job_type?: string;
  salary_currency?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  application_url?: string;
  description?: string;
}

export default function MyJobsPage() {
  const { session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!session) return;

    const fetchJobs = async () => {
      try {
        const { data: rows, error: err1 } = await supabase
          .from('user_jobs')
          .select('job_id')
          .eq('user_id', session.user.id);
        if (err1) throw err1;

        const jobIds = rows?.map(r => r.job_id) || [];
        if (jobIds.length === 0) {
          setJobs([]);
          setLoading(false);
          return;
        }

        const { data: jobsData, error: err2 } = await supabase
          .from('jobs')
          .select(`
            job_id,
            title,
            company_name,
            location,
            job_type,
            salary_currency,
            salary_min,
            salary_max,
            application_url,
            description
          `)
          .in('job_id', jobIds);
        if (err2) throw err2;

        setJobs(jobsData || []);
      } catch (err: any) {
        console.error('Error loading jobs:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [session]);

  const toggleDescription = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!session) {
    return <div className="p-6">Please sign in to view your jobs.</div>;
  }
  if (loading) {
    return <div className="p-6">Loading your jobs…</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }
  if (jobs.length === 0) {
    return <div className="p-6">You have no saved jobs.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Saved Jobs</h1>
      <ul className="grid gap-6">
        {jobs.map(job => (
          <li key={job.job_id} className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{job.title || 'Untitled Role'}</h2>
              {job.company_name && (
                <p className="text-sm text-gray-700">{job.company_name}</p>
              )}
            </div>

            {(job.location || job.job_type) && (
              <p className="text-sm text-gray-500 mb-2">
                {job.location}
                {job.location && job.job_type && ' · '}
                {job.job_type}
              </p>
            )}

            {(job.salary_currency && (job.salary_min != null || job.salary_max != null)) && (
              <p className="text-sm text-gray-800 mb-2">
                Salary:&nbsp;
                {job.salary_min != null ? `${job.salary_currency}${job.salary_min}` : 'N/A'}
                {job.salary_max != null ? ` – ${job.salary_currency}${job.salary_max}` : ''}
              </p>
            )}

            {job.description && (
              <>
                <button
                  className="text-sm text-blue-600 hover:underline mb-2"
                  onClick={() => toggleDescription(job.job_id)}
                >
                  {expanded[job.job_id] ? 'Hide details' : 'See more'}
                </button>
                {expanded[job.job_id] && (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">
                    {job.description}
                  </p>
                )}
              </>
            )}

            {job.application_url && (
              <div>
                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Apply Now
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
