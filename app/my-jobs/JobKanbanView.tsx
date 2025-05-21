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
import type { Job, JobStatus, JobStage } from "@/types/my-jobs";
import {
  STAGE_COLORS,
  KANBAN_STATUSES,
  KANBAN_LABELS,
  KANBAN_ICONS,
  KANBAN_STAGES,
  KANBAN_STAGE_LABELS,
  KANBAN_STAGE_ICONS,
} from "./constants";

export type KanbanViewMode = "status" | "stage";

interface Props {
  jobs: Job[];
  mode: KanbanViewMode;
  onStatusChange: (jobId: string, status: JobStatus) => Promise<boolean>;
  onStageChange?: (jobId: string, stage: JobStage) => Promise<boolean>;
  onArchive?: (jobId: string) => Promise<boolean>;
  onSave?: (jobId: string) => Promise<boolean>;
}

export default function JobKanbanView({
  jobs,
  mode,
  onStatusChange,
  onStageChange,
  onArchive,
  onSave,
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [overId, setOverId] = useState<string | null>(null);

  // Choose lanes, labels, and icons based on mode
  const lanes = mode === "status" ? KANBAN_STATUSES : KANBAN_STAGES;
  const labels = mode === "status" ? KANBAN_LABELS : KANBAN_STAGE_LABELS;
  const icons = mode === "status" ? KANBAN_ICONS : KANBAN_STAGE_ICONS;
  const groupKey = mode === "status" ? "status" : "stage";

  // Group jobs by selected key
  const jobsByLane = lanes.reduce<Record<string, Job[]>>((acc, lane) => {
    acc[lane] = jobs.filter((job) => (job as any)[groupKey] === lane);
    return acc;
  }, {} as Record<string, Job[]>);

  const handleDragOver = (e: DragOverEvent) =>
    setOverId(e.over?.id ? String(e.over.id) : null);

  const handleDragEnd = (e: DragEndEvent) => {
    setOverId(null);
    const { active, over } = e;
    if (!active.id || !over?.id) return;
    const jobId = String(active.id);
    const newLane = over.id as string;

    if (mode === "status") {
      onStatusChange(jobId, newLane as JobStatus);
    } else if (onStageChange) {
      onStageChange(jobId, newLane as JobStage);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-[16rem] gap-4 py-6">
          {lanes.map((lane) => (
            <motion.div
              key={lane}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * lanes.indexOf(lane) }}
              className="flex flex-col h-full"
            >
              <DroppableColumn
                id={lane}
                title={labels[lane]}
                icon={icons[lane]}
              >
                {jobsByLane[lane]?.map((job) => (
                  <DraggableCard
                    key={job.job_id}
                    id={job.job_id}
                    job={job}
                    onSave={onSave ? () => onSave(job.job_id) : undefined}
                    onArchive={
                      onArchive ? () => onArchive(job.job_id) : undefined
                    }
                  />
                ))}
              </DroppableColumn>
            </motion.div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}
