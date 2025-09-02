-- Database Schema and RLS Policies for QR Builder App
-- Run these SQL statements in your Supabase SQL Editor

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_analytics ENABLE ROW LEVEL SECURITY;

-- Add user_id column to qr_codes table if it doesn't exist
-- (The column might already exist based on the interface)
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- RLS Policies for qr_codes table

-- Policy: Users can only view their own QR codes (or public ones if user_id is null)
CREATE POLICY "Users can view own QR codes or public ones" ON qr_codes
FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Policy: Authenticated users can insert QR codes
CREATE POLICY "Authenticated users can insert QR codes" ON qr_codes
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  (auth.uid() = user_id OR user_id IS NULL)
);

-- Policy: Users can update their own QR codes
CREATE POLICY "Users can update own QR codes" ON qr_codes
FOR UPDATE USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

-- Policy: Users can delete their own QR codes
CREATE POLICY "Users can delete own QR codes" ON qr_codes
FOR DELETE USING (
  auth.uid() = user_id
);

-- RLS Policies for qr_templates table (public read access)

-- Policy: Anyone can read QR templates
CREATE POLICY "Anyone can read QR templates" ON qr_templates
FOR SELECT USING (true);

-- Policy: Only service role can modify templates (for admin use)
CREATE POLICY "Only service role can modify templates" ON qr_templates
FOR ALL USING (
  auth.role() = 'service_role'
);

-- RLS Policies for qr_analytics table

-- Policy: Users can only view analytics for their own QR codes
CREATE POLICY "Users can view analytics for own QR codes" ON qr_analytics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM qr_codes 
    WHERE qr_codes.id = qr_analytics.qr_code_id 
    AND qr_codes.user_id = auth.uid()
  )
);

-- Policy: Anyone can insert analytics (for tracking scans)
-- This allows anonymous users to record scans of QR codes
CREATE POLICY "Anyone can insert analytics" ON qr_analytics
FOR INSERT WITH CHECK (true);

-- Policy: Users can update analytics for their own QR codes
CREATE POLICY "Users can update analytics for own QR codes" ON qr_analytics
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM qr_codes 
    WHERE qr_codes.id = qr_analytics.qr_code_id 
    AND qr_codes.user_id = auth.uid()
  )
);

-- Policy: Users can delete analytics for their own QR codes
CREATE POLICY "Users can delete analytics for own QR codes" ON qr_analytics
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM qr_codes 
    WHERE qr_codes.id = qr_analytics.qr_code_id 
    AND qr_codes.user_id = auth.uid()
  )
);

-- Create or update the increment_scan_count function
CREATE OR REPLACE FUNCTION increment_scan_count(qr_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE qr_codes 
  SET 
    scan_count = COALESCE(scan_count, 0) + 1,
    last_scanned = NOW(),
    updated_at = NOW()
  WHERE id = qr_id;
END;
$$;

-- Insert some default QR templates if they don't exist
INSERT INTO qr_templates (name, type, description, default_data, default_style, category, is_popular)
VALUES
  (
    'Basic URL',
    'url',
    'Simple URL QR code with clean styling',
    '{"url": "https://example.com"}',
    '{"foreground": "#000000", "background": "#FFFFFF", "size": 200, "margin": 2, "errorCorrectionLevel": "M"}',
    'basic',
    true
  ),
  (
    'WiFi Network',
    'wifi',
    'Easy WiFi sharing with password',
    '{"ssid": "MyNetwork", "password": "mypassword", "security": "WPA", "hidden": false}',
    '{"foreground": "#1e40af", "background": "#FFFFFF", "size": 200, "margin": 2, "errorCorrectionLevel": "M"}',
    'connectivity',
    true
  ),
  (
    'Contact Card',
    'vcard',
    'Professional vCard with contact details',
    '{"firstName": "John", "lastName": "Doe", "email": "john@example.com", "phone": "+1234567890", "organization": "Company"}',
    '{"foreground": "#059669", "background": "#FFFFFF", "size": 200, "margin": 2, "errorCorrectionLevel": "M"}',
    'personal',
    true
  ),
  (
    'SMS Message',
    'sms',
    'Pre-filled SMS message',
    '{"phone": "+1234567890", "message": "Hello from QR code!"}',
    '{"foreground": "#dc2626", "background": "#FFFFFF", "size": 200, "margin": 2, "errorCorrectionLevel": "M"}',
    'communication',
    false
  ),
  (
    'Email Template',
    'email',
    'Pre-filled email with subject and body',
    '{"email": "contact@example.com", "subject": "Hello", "body": "Hi there!"}',
    '{"foreground": "#7c3aed", "background": "#FFFFFF", "size": 200, "margin": 2, "errorCorrectionLevel": "M"}',
    'communication',
    false
  )
ON CONFLICT (name) DO NOTHING;

-- Create a function to clean up old analytics data (optional)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM qr_analytics 
  WHERE scan_date < NOW() - INTERVAL '1 year';
END;
$$;

-- You can create a cron job to run this cleanup function periodically
-- SELECT cron.schedule('cleanup-analytics', '0 2 * * 0', 'SELECT cleanup_old_analytics();');

COMMENT ON TABLE qr_codes IS 'Stores QR code data with user association and RLS policies';
COMMENT ON TABLE qr_templates IS 'Public templates for quick QR code generation';
COMMENT ON TABLE qr_analytics IS 'Analytics data for QR code scans with user privacy protection';
COMMENT ON FUNCTION increment_scan_count(UUID) IS 'Safely increments scan count for a QR code';
COMMENT ON FUNCTION cleanup_old_analytics() IS 'Removes analytics data older than 1 year';
