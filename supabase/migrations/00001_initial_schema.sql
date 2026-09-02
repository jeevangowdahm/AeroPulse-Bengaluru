-- AQI SENTINEL: Bengaluru Air Quality Early-Warning & Risk-Ranking System
-- Supabase PostgreSQL Migration Schema

-- 1. Enable PostGIS if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Pollution Stations Table (Bengaluru specific)
CREATE TABLE IF NOT EXISTS pollution_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    zone_type VARCHAR(50) DEFAULT 'Urban',
    installed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Pollution Readings Table (Normalized environmental measurements)
CREATE TABLE IF NOT EXISTS pollution_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id VARCHAR(50) REFERENCES pollution_stations(station_id) ON DELETE CASCADE,
    locality VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    pm25 DOUBLE PRECISION,
    pm10 DOUBLE PRECISION,
    no2 DOUBLE PRECISION,
    so2 DOUBLE PRECISION,
    co DOUBLE PRECISION,
    o3 DOUBLE PRECISION,
    nh3 DOUBLE PRECISION,
    aqi INTEGER NOT NULL,
    composite_risk_score DOUBLE PRECISION NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- LOW, MODERATE, HIGH, CRITICAL
    source VARCHAR(100) NOT NULL, -- CPCB, Open-Meteo, KSPCB Proxy
    data_type VARCHAR(20) NOT NULL, -- LIVE, HISTORICAL, PREDICTED, ESTIMATED
    confidence DOUBLE PRECISION DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast time-series queries & locality filtering
CREATE INDEX IF NOT EXISTS idx_pollution_readings_locality_ts ON pollution_readings (locality, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_pollution_readings_aqi ON pollution_readings (aqi DESC);

-- 4. Traffic & Industrial Stack Emission Monitoring Table
CREATE TABLE IF NOT EXISTS industry_emissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_name VARCHAR(150) NOT NULL,
    area VARCHAR(100) NOT NULL,
    pollutant VARCHAR(50) NOT NULL,
    measured_value DOUBLE PRECISION NOT NULL,
    reference_threshold DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL, -- COMPLIANT, WARNING, EXCEEDANCE, DATA UNAVAILABLE
    severity VARCHAR(20) NOT NULL,
    source VARCHAR(100) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Green Bengaluru Priority & Canopy Coverage
CREATE TABLE IF NOT EXISTS green_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_name VARCHAR(100) UNIQUE NOT NULL,
    green_cover_percentage DOUBLE PRECISION NOT NULL,
    canopy_density_index DOUBLE PRECISION NOT NULL,
    priority_score DOUBLE PRECISION NOT NULL,
    recommended_tree_species TEXT[],
    target_reduction_pct DOUBLE PRECISION NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Civic Reports & Complaint Tracking Table
CREATE TABLE IF NOT EXISTS civic_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_number VARCHAR(30) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- Traffic Pollution, Industrial Emission, Construction Dust, Waste Burning, Biomass Burning
    locality VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    user_id UUID,
    aqi_at_time INTEGER,
    pm25_at_time DOUBLE PRECISION,
    no2_at_time DOUBLE PRECISION,
    ai_category VARCHAR(50),
    ai_severity VARCHAR(20),
    ai_evidence_summary TEXT,
    status VARCHAR(30) DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED, ACKNOWLEDGED, UNDER_REVIEW, ACTION_REQUIRED, RESOLVED
    submission_type VARCHAR(20) DEFAULT 'INTERNAL', -- INTERNAL, OFFICIAL_DOWNLOAD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Personal Exposure Survey Data
CREATE TABLE IF NOT EXISTS exposure_surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locality VARCHAR(100) NOT NULL,
    outdoor_hours DOUBLE PRECISION NOT NULL,
    commute_mode VARCHAR(50) NOT NULL,
    occupation VARCHAR(50) NOT NULL,
    perceived_air_quality VARCHAR(30) NOT NULL,
    exposure_score DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE pollution_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pollution_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE civic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE exposure_surveys ENABLE ROW LEVEL SECURITY;

-- Allow public read access to environmental data
CREATE POLICY "Public read environmental data" ON pollution_readings FOR SELECT USING (true);
CREATE POLICY "Public read stations" ON pollution_stations FOR SELECT USING (true);
CREATE POLICY "Public read emissions" ON industry_emissions FOR SELECT USING (true);
CREATE POLICY "Public read green zones" ON green_zones FOR SELECT USING (true);

-- Allow public insert to civic reports and exposure surveys
CREATE POLICY "Public insert civic reports" ON civic_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own civic reports" ON civic_reports FOR SELECT USING (true);
CREATE POLICY "Public insert exposure survey" ON exposure_surveys FOR INSERT WITH CHECK (true);
