'use client';

import React from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import DroppableColumn from './kanban/DroppableColumn';
import DraggableCard from './kanban/DraggableCard';
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
  onStageChange?: (jobId: string, newStage: string) => void;
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

export default function JobKanbanView({ jobs, onStageChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  const jobsByStage = STAGES.reduce<Record<string, Job[]>>((acc, stage) => {
    acc[stage] = jobs.filter((job) => (job.stage || 'none') === stage);
    return acc;
  }, {});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active?.id || !over?.id) return;

    const jobId = String(active.id);
    const newStage = String(over.id);

    const job = jobs.find((j) => j.job_id === jobId);
    if (!job || (job.stage || 'none') === newStage) return;

    onStageChange?.(jobId, newStage);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <div className="flex gap-4 w-[1200px]">
          {STAGES.map((stage) => (
            <DroppableColumn key={stage} id={stage} title={stage} icon={STAGE_ICONS[stage]}>
              {jobsByStage[stage].map((job) => (
                <DraggableCard key={job.job_id} id={job.job_id} job={job} />
              ))}
            </DroppableColumn>
          ))}
        </div>
      </div>
    </DndContext>
  );
}
