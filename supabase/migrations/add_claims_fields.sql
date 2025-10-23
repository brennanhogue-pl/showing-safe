-- Add new fields to claims table for detailed claim information

ALTER TABLE claims
ADD COLUMN IF NOT EXISTS incident_date DATE,
ADD COLUMN IF NOT EXISTS damaged_items TEXT,
ADD COLUMN IF NOT EXISTS supra_showing_number TEXT;

-- Add comments for documentation
COMMENT ON COLUMN claims.incident_date IS 'Date when the incident occurred';
COMMENT ON COLUMN claims.damaged_items IS 'List of items that were damaged';
COMMENT ON COLUMN claims.supra_showing_number IS 'Supra lockbox showing confirmation number';
