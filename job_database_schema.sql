-- Schema for job posting data pipeline

-- 1. Raw SERPER API results
CREATE TABLE serper_results (
    serper_result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,                    -- The search query used
    result_json JSONB NOT NULL,             -- Full JSON response from SERPER
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,        -- Flag to track processing status
    search_date DATE NOT NULL               -- Date the search was performed
);

-- 2. Extracted job links from SERPER results
CREATE TABLE job_links (
    job_link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serper_result_id UUID REFERENCES serper_results(serper_result_id),
    url TEXT NOT NULL,                      -- The job posting URL
    title TEXT,                             -- Title from SERPER snippet
    snippet TEXT,                           -- Preview snippet from SERPER
    source_date TEXT,                       -- Date string from SERPER (e.g., "2 days ago")
    position INTEGER,                       -- Position in search results
    domain TEXT NOT NULL,                   -- Extracted domain (e.g., "lever.co", "greenhouse.io")
    crawl_status VARCHAR(20) DEFAULT 'pending', -- Status: pending, in_progress, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_crawled_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(url)                             -- Prevent duplicate URLs
);

-- 3. Crawled job content
CREATE TABLE job_crawl_results (
    crawl_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_link_id UUID NOT NULL REFERENCES job_links(job_link_id),
    http_status INTEGER,                    -- HTTP status code from crawl
    title TEXT,                             -- Page title from crawled content
    meta_description TEXT,                  -- Meta description from page
    body_content TEXT,                      -- Main text content from page
    raw_html TEXT,                          -- Raw HTML for reference/reprocessing
    crawled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    extraction_successful BOOLEAN,          -- Whether content extraction succeeded
    processing_status VARCHAR(20) DEFAULT 'pending' -- Status: pending, processed, failed
);

-- 4. Final processed jobs
CREATE TABLE jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crawl_id UUID REFERENCES job_crawl_results(crawl_id),
    title TEXT NOT NULL,
    company_name TEXT,
    location TEXT,
    job_type TEXT,                          -- Full-time, part-time, contract, etc.
    remote_status TEXT,                     -- Remote, hybrid, on-site
    description TEXT,                       -- Processed job description
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency VARCHAR(3),
    application_url TEXT,                   -- URL to apply (may differ from crawled URL)
    source_domain TEXT NOT NULL,            -- Which ATS system: lever.co, greenhouse.io, etc.
    confidence_score FLOAT,                 -- Confidence in extracted data quality
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE          -- Whether job is still active
);

-- 5. Extracted skills (many-to-many relationship)
CREATE TABLE skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT,                         -- Technical, soft skill, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_skills (
    job_id UUID REFERENCES jobs(job_id),
    skill_id UUID REFERENCES skills(skill_id),
    confidence_score FLOAT,               -- Confidence in skill extraction
    is_required BOOLEAN,                  -- Whether skill is required or preferred
    PRIMARY KEY (job_id, skill_id)
);

-- 6. Error logging for pipeline issues
CREATE TABLE pipeline_errors (
    error_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage VARCHAR(20) NOT NULL,           -- 'serper', 'link_extraction', 'crawling', 'processing'
    related_id UUID,                      -- ID of the record where error occurred
    error_message TEXT NOT NULL,
    error_details JSONB,                  -- Additional error context
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Processing metrics and stats
CREATE TABLE pipeline_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_date DATE NOT NULL,
    queries_executed INTEGER DEFAULT 0,
    links_extracted INTEGER DEFAULT 0,
    successful_crawls INTEGER DEFAULT 0,
    failed_crawls INTEGER DEFAULT 0,
    jobs_created INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    processing_time_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_job_links_status ON job_links(crawl_status);
CREATE INDEX idx_job_links_domain ON job_links(domain);
CREATE INDEX idx_crawl_results_status ON job_crawl_results(processing_status);
CREATE INDEX idx_jobs_source ON jobs(source_domain);
CREATE INDEX idx_jobs_created ON jobs(created_at);
CREATE INDEX idx_jobs_active ON jobs(is_active);
