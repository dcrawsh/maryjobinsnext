'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Job {
  job_id: string;
  title: string;
  company_name: string;
  stage: string | null;
}

interface Props {
  id: string;
  job: Job;
}

export default function DraggableCard({ id, job }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
    transition: 'transform 200ms ease', // apply manually if needed
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white rounded border p-2 shadow-sm text-sm hover:bg-gray-50 cursor-move"
    >
      <div className="font-medium text-gray-900 line-clamp-1">{job.title}</div>
      <div className="text-gray-500 line-clamp-1">{job.company_name}</div>
    </li>
  );
}
