
-- VR Business Specialist Database Schema
-- Generated from 360 Business Magician automation system

-- VR Clients Table
CREATE TABLE vr_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    case_status VARCHAR(50) CHECK (case_status IN ('active', 'pending', 'completed', 'suspended')) DEFAULT 'pending',
    assigned_specialist VARCHAR(255) NOT NULL,
    current_milestone VARCHAR(255),
    next_action_date DATE,
    funding_eligibility BOOLEAN DEFAULT false,
    documents_submitted BOOLEAN DEFAULT false,
    map_location TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    service_category VARCHAR(255),
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2) DEFAULT 0,
    start_date DATE DEFAULT CURRENT_DATE,
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Milestones Table
CREATE TABLE vr_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES vr_clients(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    completion_date DATE,
    estimated_timeline VARCHAR(100),
    cost_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Service Categories Table
CREATE TABLE vr_service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(255) NOT NULL UNIQUE,
    min_cost DECIMAL(10,2) NOT NULL,
    max_cost DECIMAL(10,2) NOT NULL,
    description TEXT,
    estimated_weeks INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Specialists Table
CREATE TABLE vr_specialists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    specialization VARCHAR(255),
    certification_level VARCHAR(100),
    active_cases INTEGER DEFAULT 0,
    max_cases INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VR Progress Logs Table
CREATE TABLE vr_progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES vr_clients(id) ON DELETE CASCADE,
    milestone VARCHAR(255),
    progress_percentage INTEGER,
    notes TEXT,
    logged_by VARCHAR(255),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert service categories
INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('Exploration & Concept Development', 122, 551, 4);
INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('Feasibility Studies', 151, 551, 4);
INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('Business Planning', 1286, 1780, 4);
INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('Self-Employment Services Plan', 151, 151, 4);
INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('Supported Start-Up', 2021, 2021, 4);
INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('Business Maintenance', 1011, 1011, 8);
INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('Business Stability', 1511, 1511, 8);
INSERT INTO vr_service_categories (category_name, min_cost, max_cost, estimated_weeks) 
   VALUES ('Service Closure', 3023, 3023, 12);

-- Create indexes for performance
CREATE INDEX idx_vr_clients_status ON vr_clients(case_status);
CREATE INDEX idx_vr_clients_specialist ON vr_clients(assigned_specialist);
CREATE INDEX idx_vr_milestones_client ON vr_milestones(client_id);
CREATE INDEX idx_vr_progress_client ON vr_progress_logs(client_id);
