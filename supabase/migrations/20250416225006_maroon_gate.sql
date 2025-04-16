/*
  # Add resume column to job_searches table

  1. Changes
    - Add resume_url column to store the file URL

  2. Security
    - Maintain existing RLS policies
*/

-- Add resume column
ALTER TABLE job_searches 
ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- Create storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Enable storage policies for authenticated users
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);