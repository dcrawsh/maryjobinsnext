"use client";
import React, { useState } from "react";
import { 
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import DroppableColumn from "./kanban/DroppableColumn";
import DraggableCard from "./kanban/DraggableCard";
import { motion } from "framer-motion";
import { Hourglass, FileText, UserCheck, DollarSign, CheckCircle, Ban } from "lucide-react";
import type { Job, JobStage } from "@/types/my-jobs";

interface Props {
  jobs: Job[];
  onStageChange?: (jobId: string, newStage: JobStage) => Promise<boolean>;
}

const STAGES: JobStage[] = ["none", "applied", "interviewing", "offer", "hired", "rejected"];
const STAGE_ICONS: Record<JobStage, JSX.Element> = {
  none: <Hourglass className="h-4 w-4 text-gray-500" />,
  applied: <FileText className="h-4 w-4 text-blue-500" />,
  interviewing: <UserCheck className="h-4 w-4 text-yellow-500" />,
  offer: <DollarSign className="h-4 w-4 text-green-500" />,
  hired: <CheckCircle className="h-4 w-4 text-emerald-600" />,
  rejected: <Ban className="h-4 w-4 text-red-500" />,
};

export default function JobKanbanView({ jobs, onStageChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [overId, setOverId] = useState<string | null>(null);
  const jobsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = jobs.filter((j) => (j.stage || "none") === stage);
    return acc;
  }, {} as Record<JobStage, Job[]>);

  const handleDragOver = (e: DragOverEvent) => setOverId(e.over?.id ? String(e.over.id) : null);
  const handleDragEnd = (e: DragEndEvent) => {
    setOverId(null);
    const { active, over } = e;
    if (!active?.id || !over?.id) return;
    const jobId = String(active.id);
    const newStage = over.id as JobStage;
    const job = jobs.find((j) => j.job_id === jobId);
    if (!job || (job.stage || "none") === newStage) return;
    onStageChange?.(jobId, newStage);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        {/* Use CSS grid for uniform columns */}
        <div className="grid grid-flow-col  gap-2 py-6">
          {STAGES.map((stage) => (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * STAGES.indexOf(stage) }}
              className="flex h-full"
            >
              <DroppableColumn id={stage} title={stage} icon={STAGE_ICONS[stage]}>
                {jobsByStage[stage].map((job) => (
                  <DraggableCard key={job.job_id} id={job.job_id} job={job} />
                ))}
              </DroppableColumn>
            </motion.div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}