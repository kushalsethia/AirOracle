-- Air Quality Monitoring Table Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the air_quality table
CREATE TABLE IF NOT EXISTS air_quality (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  temperature DECIMAL(5,2) NOT NULL,
  humidity DECIMAL(5,2) NOT NULL,
  co2 DECIMAL(8,2) NOT NULL,
  pm1_0 DECIMAL(8,2) NOT NULL,
  pm2_5 DECIMAL(8,2) NOT NULL,
  pm10 DECIMAL(8,2) NOT NULL,
  carbon_monoxide DECIMAL(8,2) NOT NULL,
  voc DECIMAL(8,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE air_quality ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
-- Adjust this policy based on your security requirements
CREATE POLICY "Allow public read access" ON air_quality
  FOR SELECT USING (true);

-- Create a policy to allow inserts (for your monitoring system)
CREATE POLICY "Allow public insert access" ON air_quality
  FOR INSERT WITH CHECK (true);

-- Enable real-time for the table
ALTER PUBLICATION supabase_realtime ADD TABLE air_quality;

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_air_quality_created_at ON air_quality(created_at DESC);

-- Optional: Add a comment to the table
COMMENT ON TABLE air_quality IS 'Indoor air quality monitoring data with real-time updates';

