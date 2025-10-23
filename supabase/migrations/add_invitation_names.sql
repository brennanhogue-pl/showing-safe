-- Add first_name and last_name to invitations table
ALTER TABLE invitations
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Create index for name searches
CREATE INDEX idx_invitations_names ON invitations(first_name, last_name);

-- Add comment
COMMENT ON COLUMN invitations.first_name IS 'First name of the invited user';
COMMENT ON COLUMN invitations.last_name IS 'Last name of the invited user';
