#! usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const SQL = `
DROP TABLE IF EXISTS colors_tags CASCADE;
DROP TABLE IF EXISTS colors_palettes CASCADE;
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS palettes CASCADE;

-- Recreate tables
CREATE TABLE IF NOT EXISTS colors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(7) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT check_color_code CHECK (code ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS palettes (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS colors_tags (
  color_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (color_id, tag_id),
  CONSTRAINT fk_colors_tags_color_id FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE CASCADE,
  CONSTRAINT fk_colors_tags_tag_id FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS colors_palettes (
  color_id INTEGER,
  palette_id INTEGER,
  color_position INTEGER NOT NULL,
  PRIMARY KEY (color_id, palette_id),
  CONSTRAINT fk_colors_palettes_color_id FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE CASCADE,
  CONSTRAINT fk_colors_palettes_palette_id FOREIGN KEY (palette_id) REFERENCES palettes(id) ON DELETE CASCADE,
  CONSTRAINT unique_palette_color_position UNIQUE (palette_id, color_position)
);

-- Insert Colors
INSERT INTO colors (name, code, created_at) VALUES
  ('Deep Navy', '#011627', NOW()),       -- ID 1 (Tic Tac Toe)
  ('Off White', '#FDFFFC', NOW()),       -- ID 2 (Tic Tac Toe)
  ('Teal Green', '#2EC4B6', NOW()),      -- ID 3 (Tic Tac Toe)
  ('Bright Red', '#E71D36', NOW()),      -- ID 4 (Tic Tac Toe)
  ('Vibrant Orange', '#FF9F1C', NOW()),  -- ID 5 (Tic Tac Toe)
  ('Sky Blue', '#0496FF', NOW()),        -- ID 6 (Sassy Romaine)
  ('Golden Yellow', '#FFBC42', NOW()),   -- ID 7 (Sassy Romaine)
  ('Deep Pink', '#D81159', NOW()),       -- ID 8 (Sassy Romaine)
  ('Google Blue', '#4285F4', NOW()),     -- ID 9 (Google)
  ('Google Red', '#DB4437', NOW()),      -- ID 10 (Google)
  ('Google Yellow', '#F4B400', NOW()),   -- ID 11 (Google)
  ('Google Green', '#0F9D58', NOW());    -- ID 12 (Google)

-- Insert Tags
INSERT INTO tags (name, created_at) VALUES
  ('Dark', NOW()),        -- ID 1
  ('Light', NOW()),       -- ID 2
  ('Vibrant', NOW()),     -- ID 3
  ('Corporate', NOW()),   -- ID 4
  ('Playful', NOW());      -- ID 5

-- Insert Palettes
INSERT INTO palettes (name, description, created_at) VALUES
  ('Tic Tac Toe', 'A modern, high-contrast palette suitable for tech or gaming.', NOW()), -- ID 1
  ('Sassy Romaine', 'A bold and energetic palette with a playful feel.', NOW()),          -- ID 2
  ('Google', 'The iconic primary colors associated with the Google brand.', NOW());     -- ID 3

-- Insert Colors-Palettes relations
-- Palette: Tic Tac Toe (ID 1)
-- Colors: #011627 (ID 1), #FDFFFC (ID 2), #2EC4B6 (ID 3), #E71D36 (ID 4), #FF9F1C (ID 5)
INSERT INTO colors_palettes (palette_id, color_id, color_position) VALUES
  (1, 1, 1),
  (1, 2, 2),
  (1, 3, 3),
  (1, 4, 4),
  (1, 5, 5);

-- Palette: Sassy Romaine (ID 2)
-- Colors: #0496FF (ID 6), #FFBC42 (ID 7), #D81159 (ID 8)
INSERT INTO colors_palettes (palette_id, color_id, color_position) VALUES
  (2, 6, 1),
  (2, 7, 2),
  (2, 8, 3);

-- Palette: Google (ID 3)
-- Colors: #4285F4 (ID 9), #DB4437 (ID 10), #F4B400 (ID 11), #0F9D58 (ID 12)
INSERT INTO colors_palettes (palette_id, color_id, color_position) VALUES
  (3, 9, 1),
  (3, 10, 2),
  (3, 11, 3),
  (3, 12, 4);

-- Insert Colors-Tags relations
-- Tag IDs: Dark (1), Light (2), Vibrant (3), Corporate (4), Playful (5)
-- Color IDs are as per the INSERT INTO colors statement above.

-- Tic Tac Toe Colors
INSERT INTO colors_tags (color_id, tag_id) VALUES
  (1, 1), -- Deep Navy (#011627) is Dark
  (2, 2), -- Off White (#FDFFFC) is Light
  (3, 3), -- Teal Green (#2EC4B6) is Vibrant
  (3, 5), -- Teal Green (#2EC4B6) is Playful
  (4, 3), -- Bright Red (#E71D36) is Vibrant
  (4, 5), -- Bright Red (#E71D36) is Playful
  (5, 3), -- Vibrant Orange (#FF9F1C) is Vibrant
  (5, 5); -- Vibrant Orange (#FF9F1C) is Playful

-- Sassy Romaine Colors
INSERT INTO colors_tags (color_id, tag_id) VALUES
  (6, 3), -- Sky Blue (#0496FF) is Vibrant
  (6, 5), -- Sky Blue (#0496FF) is Playful
  (7, 3), -- Golden Yellow (#FFBC42) is Vibrant
  (7, 2), -- Golden Yellow (#FFBC42) is Light (ish)
  (7, 5), -- Golden Yellow (#FFBC42) is Playful
  (8, 3); -- Deep Pink (#D81159) is Vibrant

-- Google Colors
INSERT INTO colors_tags (color_id, tag_id) VALUES
  (9, 3),  -- Google Blue (#4285F4) is Vibrant
  (9, 4),  -- Google Blue (#4285F4) is Corporate
  (10, 3), -- Google Red (#DB4437) is Vibrant
  (10, 4), -- Google Red (#DB4437) is Corporate
  (11, 3), -- Google Yellow (#F4B400) is Vibrant
  (11, 2), -- Google Yellow (#F4B400) is Light
  (11, 4), -- Google Yellow (#F4B400) is Corporate
  (12, 3), -- Google Green (#0F9D58) is Vibrant
  (12, 4); -- Google Green (#0F9D58) is Corporate
`;

async function main() {
  console.log('Connecting to database...');

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Populating database...');
    await client.query(SQL);
    console.log('Database populated with success');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
    console.log('Done');
  }
}

main().catch(console.error);
