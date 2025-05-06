import React from 'react';
import {
  CheckCircle,
  FileText,
  UserCheck,
  Ban,
  Hourglass,
  DollarSign,
} from 'lucide-react';

interface Job {
  job_id: string;
  title: string;
  company_name: string;
  stage: string | null;
}

interface Props {
  jobs: Job[];
}

const STAGE_ICONS: Record<string, JSX.Element> = {
  none: <Hourglass className="h-4 w-4 text-gray-500" />,
  applied: <FileText className="h-4 w-4 text-blue-500" />,
  interviewing: <UserCheck className="h-4 w-4 text-yellow-500" />,
  offer: <DollarSign className="h-4 w-4 text-green-500" />,
  hired: <CheckCircle className="h-4 w-4 text-emerald-600" />,
  rejected: <Ban className="h-4 w-4 text-red-500" />,
};

const STAGES = ['none', 'applied', 'interviewing', 'offer', 'hired', 'rejected'];

export default function JobKanbanView({ jobs }: Props) {
  const jobsByStage = STAGES.reduce<Record<string, Job[]>>((acc, stage) => {
    acc[stage] = jobs.filter(job => (job.stage || 'none') === stage);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 w-[1200px]">
        {STAGES.map(stage => (
          <div key={stage} className="w-1/6 min-w-[180px] bg-gray-50 rounded-lg p-2 border">
            <div className="flex items-center gap-2 font-semibold mb-2">
              {STAGE_ICONS[stage]}
              <span className="capitalize text-sm">{stage}</span>
            </div>
            <ul className="space-y-2">
              {jobsByStage[stage].map(job => (
                <li
                  key={job.job_id}
                  className="bg-white rounded border p-2 shadow-sm text-sm hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-900 line-clamp-1">{job.title}</div>
                  <div className="text-gray-500 line-clamp-1">{job.company_name}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
