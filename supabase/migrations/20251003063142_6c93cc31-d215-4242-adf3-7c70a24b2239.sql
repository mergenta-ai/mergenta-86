-- Priority 2 Part 1: Extend vendor_type enum with new vendors
ALTER TYPE vendor_type ADD VALUE IF NOT EXISTS 'elevenlabs';
ALTER TYPE vendor_type ADD VALUE IF NOT EXISTS 'cloudconvert';
ALTER TYPE vendor_type ADD VALUE IF NOT EXISTS 'local';
ALTER TYPE vendor_type ADD VALUE IF NOT EXISTS 'meta';
ALTER TYPE vendor_type ADD VALUE IF NOT EXISTS 'microsoft';