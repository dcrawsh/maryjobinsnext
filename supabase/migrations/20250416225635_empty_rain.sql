/*
  # Update Resume Storage Method

  1. Changes
    - Add resume_data column to store resume content directly
    - Drop storage bucket policies since we're not using them anymore
    - Drop resume_url column as it's no longer needed

  2. Security
    - Maintain existing RLS policies
*/

-- Add resume_data column if it doesn't exist
ALTER TABLE job_searches 
ADD COLUMN IF NOT EXISTS resume_data TEXT;

-- Drop storage policies
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own resumes" ON storage.objects;

-- Drop resume_url column
ALTER TABLE job_searches 
DROP COLUMN IF EXISTS resume_url;