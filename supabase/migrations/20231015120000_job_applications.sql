
-- Create job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    job_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    auto_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own applications
CREATE POLICY "Users can view their own job applications" 
    ON public.job_applications FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow users to insert their own applications
CREATE POLICY "Users can create their own job applications" 
    ON public.job_applications FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own applications
CREATE POLICY "Users can update their own job applications" 
    ON public.job_applications FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS job_applications_user_id_idx 
    ON public.job_applications(user_id);
