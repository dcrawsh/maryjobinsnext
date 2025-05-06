'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabaseBrowser';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  CheckCircle,
  FileText,
  UserCheck,
  Ban,
  Hourglass,
  ArrowDownAZ,
  ArrowUpDown,
  DollarSign,
  LayoutList,
  Columns3,
} from 'lucide-react';
import JobKanbanView from './JobKanbanView';

interface Job {
  job_id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  salary_currency: string;
  salary_min: number | null;
  salary_max: number | null;
  application_url: string;
  description: string;
  status: string | null;
  stage: string | null;
}

const STAGE_ICONS: Record<string, JSX.Element> = {
  none: <Hourglass className="h-4 w-4 mr-2" />,
  applied: <FileText className="h-4 w-4 mr-2" />,
  interviewing: <UserCheck className="h-4 w-4 mr-2" />,
  offer: <DollarSign className="h-4 w-4 mr-2" />,
  hired: <CheckCircle className="h-4 w-4 mr-2" />,
  rejected: <Ban className="h-4 w-4 mr-2" />,
};

export default function MyJobsPage() {
  const { session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'newest' | 'salary' | 'title'>('newest');
  const [filterStage, setFilterStage] = useState<string>('__all__');
  const [kanbanView, setKanbanView] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchJobs = async () => {
      try {
        const { data: rows, error: err1 } = await supabase
          .from('user_jobs')
          .select('job_id, status, stage')
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

        const jobMetaMap = Object.fromEntries(
          rows.map(r => [r.job_id, { status: r.status, stage: r.stage }])
        );

        const enrichedJobs = (jobsData || []).map(job => ({
          ...job,
          status: jobMetaMap[job.job_id]?.status || null,
          stage: jobMetaMap[job.job_id]?.stage || null,
        }));

        setJobs(enrichedJobs);
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

  const filteredJobs = jobs
    .filter(job => (filterStage !== '__all__' ? job.stage === filterStage : true))
    .sort((a, b) => {
      if (sortBy === 'salary') return (b.salary_max || 0) - (a.salary_max || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  if (!session) return <div className="p-6">Please sign in to view your jobs.</div>;
  if (loading) return <div className="p-6">Loading your jobs…</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={sortBy} onValueChange={val => setSortBy(val as any)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <ArrowUpDown className="h-4 w-4 mr-2" /> Newest
              </SelectItem>
              <SelectItem value="salary">
                <DollarSign className="h-4 w-4 mr-2" /> Salary
              </SelectItem>
              <SelectItem value="title">
                <ArrowDownAZ className="h-4 w-4 mr-2" /> Title
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStage} onValueChange={val => setFilterStage(val)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All</SelectItem>
              {Object.keys(STAGE_ICONS).map(stage => (
                <SelectItem key={stage} value={stage}>
                  {STAGE_ICONS[stage]} {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={() => setKanbanView(v => !v)}
            className="flex items-center px-3 py-2 border rounded text-sm hover:bg-gray-50"
          >
            {kanbanView ? (
              <LayoutList className="w-4 h-4 mr-2" />
            ) : (
              <Columns3 className="w-4 h-4 mr-2" />
            )}
            {kanbanView ? 'List View' : 'Kanban View'}
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-gray-500 text-sm">No jobs match your filters.</div>
      ) : kanbanView ? (
        <JobKanbanView
  jobs={filteredJobs}
  onStageChange={async (jobId, newStage) => {
    const { error } = await supabase
      .from('user_jobs')
      .update({ stage: newStage })
      .eq('user_id', session.user.id)
      .eq('job_id', jobId);

    if (!error) {
      setJobs((prev) =>
        prev.map((j) => (j.job_id === jobId ? { ...j, stage: newStage } : j))
      );
      toast.success('Stage updated');
    } else {
      toast.error('Error updating stage');
    }
  }}
/>

      ) : (
        <ul className="space-y-6">
          {filteredJobs.map(job => (
            <li key={job.job_id} className="p-6 border rounded-lg shadow-sm bg-white space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
                  <p className="text-gray-700">{job.company_name}</p>
                  <p className="text-gray-500">{job.location} · {job.job_type}</p>
                  <p className="text-gray-800">
                    Salary: {job.salary_currency}
                    {job.salary_min ?? 'N/A'}
                    {job.salary_max != null ? ` - ${job.salary_currency}${job.salary_max}` : ''}
                  </p>
                </div>
                {job.stage && STAGE_ICONS[job.stage]}
              </div>

              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => toggleDescription(job.job_id)}
              >
                {expanded[job.job_id] ? 'Hide details' : 'See more'}
              </button>
              {expanded[job.job_id] && (
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{job.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select
                    value={job.status || ''}
                    onValueChange={async (newStatus) => {
                      const { error } = await supabase
                        .from('user_jobs')
                        .update({ status: newStatus })
                        .eq('user_id', session.user.id)
                        .eq('job_id', job.job_id);
                      if (!error) {
                        setJobs(prev =>
                          prev.map(j =>
                            j.job_id === job.job_id ? { ...j, status: newStatus } : j
                          )
                        );
                        toast.success('Status updated');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="saved">Saved</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                      <SelectItem value="not_relevant">Not Relevant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <Select
                    value={job.stage || ''}
                    onValueChange={async (newStage) => {
                      const { error } = await supabase
                        .from('user_jobs')
                        .update({ stage: newStage })
                        .eq('user_id', session.user.id)
                        .eq('job_id', job.job_id);
                      if (!error) {
                        setJobs(prev =>
                          prev.map(j =>
                            j.job_id === job.job_id ? { ...j, stage: newStage } : j
                          )
                        );
                        toast.success('Stage updated');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(STAGE_ICONS).map(stage => (
                        <SelectItem key={stage} value={stage}>
                          {STAGE_ICONS[stage]} {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <a
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
                >
                  Apply Now
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
