/*
  # Create Job Searches Table

  1. New Tables
    - `job_searches`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `job_title` (text)
      - `years_of_experience` (text)
      - `location` (text)
      - `skill_level` (text)
      - `remote_preference` (text)

  2. Security
    - Enable RLS on `job_searches` table
    - Add policy for inserting data
*/

CREATE TABLE IF NOT EXISTS job_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  job_title text NOT NULL,
  years_of_experience text NOT NULL,
  location text NOT NULL,
  skill_level text NOT NULL,
  remote_preference text NOT NULL
);

ALTER TABLE job_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert access for all users" ON job_searches
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON job_searches
  FOR SELECT
  TO public
  USING (true);