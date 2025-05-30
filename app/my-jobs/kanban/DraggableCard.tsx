"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Job } from "@/types/my-jobs";
import { motion } from "framer-motion";

interface Props {
  id: string;
  job: Job;
  onSave?: () => void;
  onArchive?: () => void;
}

export default function DraggableCard({ id, job, onSave, onArchive }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: 999,
      }
    : undefined;

  return (
    <motion.li
      layout
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-lg shadow ${isDragging ? "opacity-80" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company_name}</p>
        </div>
      </div>
    </motion.li>
  );
}
