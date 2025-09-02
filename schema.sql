-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- QR Codes table
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    style JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_url TEXT,
    scan_count INTEGER DEFAULT 0,
    last_scanned TIMESTAMP WITH TIME ZONE,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR Templates table
CREATE TABLE IF NOT EXISTS public.qr_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    default_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    default_style JSONB NOT NULL DEFAULT '{}'::jsonb,
    category TEXT NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR Analytics table
CREATE TABLE IF NOT EXISTS public.qr_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    qr_code_id UUID NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
    scan_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    country TEXT,
    city TEXT,
    device_type TEXT
);

-- Function to increment scan count
CREATE OR REPLACE FUNCTION public.increment_scan_count(qr_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.qr_codes 
    SET scan_count = scan_count + 1, 
        last_scanned = NOW(),
        updated_at = NOW()
    WHERE id = qr_id;
END;
$$ LANGUAGE plpgsql;

-- Insert some default templates
INSERT INTO public.qr_templates (name, type, description, default_data, default_style, category, is_popular) VALUES
('Website Template', 'URL', 'Quick website QR code', '{"url": "https://example.com"}', '{"foregroundColor": "#000000", "backgroundColor": "#ffffff", "size": 256, "margin": 4}', 'web', true),
('Email Template', 'EMAIL', 'Contact email QR code', '{"email": "hello@example.com", "subject": "Hello", "body": "Hi there!"}', '{"foregroundColor": "#16a085", "backgroundColor": "#ffffff", "size": 256, "margin": 4}', 'contact', true),
('WiFi Template', 'WIFI', 'Share WiFi credentials', '{"ssid": "MyNetwork", "password": "password123", "security": "WPA", "hidden": false}', '{"foregroundColor": "#8e44ad", "backgroundColor": "#ffffff", "size": 256, "margin": 4}', 'network', true),
('Business Card', 'VCARD', 'Professional contact card', '{"name": "John Doe", "organization": "Company Inc.", "phone": "+1 234 567 8900", "email": "john@company.com", "website": "https://company.com"}', '{"foregroundColor": "#2c3e50", "backgroundColor": "#ffffff", "size": 256, "margin": 4}', 'contact', true);

-- Row Level Security (optional - enable if you want user-specific data)
-- ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.qr_analytics ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON public.qr_codes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_codes_type ON public.qr_codes(type);
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON public.qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_qr_code_id ON public.qr_analytics(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_analytics_scan_date ON public.qr_analytics(scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_qr_templates_category ON public.qr_templates(category);
CREATE INDEX IF NOT EXISTS idx_qr_templates_popular ON public.qr_templates(is_popular DESC);
