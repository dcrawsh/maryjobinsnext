/*
  # Add user_id to job searches and update policies

  1. Changes
    - Add user_id column to job_searches table
    - Add foreign key constraint to auth.users
    - Update RLS policies for proper user access control

  2. Security
    - Enable RLS (already enabled)
    - Update policies to restrict access to user's own data
    - Add policy for authenticated users to read their own data
*/

-- Add user_id column
ALTER TABLE job_searches ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert access for all users" ON job_searches;
DROP POLICY IF EXISTS "Enable read access for all users" ON job_searches;

-- Create new policies
CREATE POLICY "Users can insert their own data"
ON job_searches FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own data"
ON job_searches FOR SELECT
TO authenticated
USING (auth.uid() = user_id);