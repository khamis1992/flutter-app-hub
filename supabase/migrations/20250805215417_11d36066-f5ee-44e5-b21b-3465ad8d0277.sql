-- Create enum for project types
CREATE TYPE project_type AS ENUM ('mobile_app', 'web_app', 'api', 'game', 'ecommerce', 'social', 'productivity', 'other');

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    project_type project_type DEFAULT 'mobile_app',
    framework TEXT DEFAULT 'flutter',
    generated_code JSONB,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_history table
CREATE TABLE public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message_type TEXT NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    default_framework TEXT DEFAULT 'flutter',
    ai_model TEXT DEFAULT 'gpt-4o-mini',
    theme TEXT DEFAULT 'system',
    language TEXT DEFAULT 'ar',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects" 
ON public.projects FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for chat_history
CREATE POLICY "Users can view their own chat history" 
ON public.chat_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat history" 
ON public.chat_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
ON public.user_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_chat_history_project_id ON public.chat_history(project_id);
CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON public.chat_history(created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();