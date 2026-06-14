-- Items Database Schema
-- Database: item_db

-- Item categories
CREATE TABLE IF NOT EXISTS item_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES item_categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    stock INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Archived')),
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item history (audit log)
CREATE TABLE IF NOT EXISTS item_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL,
    changes JSONB,
    performed_by UUID,
    performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item tags
CREATE TABLE IF NOT EXISTS item_tags (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (item_id, tag)
);

-- Indexes
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_items_created_by ON items(created_by);
CREATE INDEX idx_item_history_item_id ON item_history(item_id);
CREATE INDEX idx_item_tags_tag ON item_tags(tag);

-- Default categories
INSERT INTO item_categories (name, description) VALUES
    ('Electronics', 'Electronic devices and accessories'),
    ('Clothing', 'Apparel and fashion items'),
    ('Home', 'Home and living products'),
    ('Sports', 'Sports and outdoor equipment')
ON CONFLICT (name) DO NOTHING;
