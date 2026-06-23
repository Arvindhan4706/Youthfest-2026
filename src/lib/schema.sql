-- 1. Create the visitors table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.visitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    college TEXT,
    department TEXT,
    year TEXT,
    gender TEXT,
    city TEXT,
    registered_events JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the attendance table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id UUID NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL,
    checkin_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(visitor_id, event_id)
);

-- 3. Create the od_requests table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.od_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id UUID NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
    document_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.od_requests ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if any to avoid errors
DROP POLICY IF EXISTS "Enable read access for all users" ON public.visitors;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.visitors;
DROP POLICY IF EXISTS "Enable update for all users" ON public.visitors;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.attendance;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.attendance;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.od_requests;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.od_requests;
DROP POLICY IF EXISTS "Enable update for all users" ON public.od_requests;

-- 6. Create Open Policies so the Client App can Read/Write directly
CREATE POLICY "Enable read access for all users" ON public.visitors FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.visitors FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.attendance FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.od_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.od_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.od_requests FOR UPDATE USING (true);
