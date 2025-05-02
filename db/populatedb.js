#! usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const SQL = `
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
INSERT INTO colors (name, code, created_at)
  VALUES ('Red', '#FF0000', NOW());
INSERT INTO colors (name, code, created_at)
  VALUES ('Green', '#00FF00', NOW());
INSERT INTO colors (name, code, created_at)
  VALUES ('Blue', '#0000FF', NOW());
INSERT INTO colors (name, code, created_at)
  VALUES ('White', '#FFFFFF', NOW());
INSERT INTO colors (name, code, created_at)
  VALUES ('Gray', '#808080', NOW());
INSERT INTO colors (name, code, created_at)
  VALUES ('Black', '#000000', NOW());
INSERT INTO colors (name, code, created_at)
  VALUES ('Orange', '#FFA500', NOW());

-- Insert Palettes
INSERT INTO palettes (name, description, created_at)
  VALUES ('Red Green Blue', 'The infamous RGB', NOW());
INSERT INTO palettes (name, description, created_at)
  VALUES ('Monochromatic', 'The most pure form of minimalism', NOW());
INSERT INTO palettes (name, description, created_at)
  VALUES ('Summer', 'When i met you in the summer!', NOW());

-- Insert Tags
INSERT INTO tags (name, created_at)
  VALUES ('Warm', NOW());
INSERT INTO tags (name, created_at)
  VALUES ('Neutral', NOW());
INSERT INTO tags (name, created_at)
  VALUES ('Primary', NOW());

-- Insert Colors-Palettes relation
INSERT INTO colors_palettes (color_id, palette_id, color_position)
  VALUES (1, 1, 1);
INSERT INTO colors_palettes (color_id, palette_id, color_position)
  VALUES (2, 1, 2);
INSERT INTO colors_palettes (color_id, palette_id, color_position)
  VALUES (3, 1, 3);

INSERT INTO colors_palettes (color_id, palette_id, color_position)
  VALUES (4, 2, 1);
INSERT INTO colors_palettes (color_id, palette_id, color_position)
  VALUES (5, 2, 2);
INSERT INTO colors_palettes (color_id, palette_id, color_position)
  VALUES (6, 2, 3);


INSERT INTO colors_palettes (color_id, palette_id, color_position)
  VALUES (1, 3, 1);
INSERT INTO colors_palettes (color_id, palette_id, color_position)
  VALUES (7, 3, 2);

-- Insert Colors-Tags relation
INSERT INTO colors_tags (color_id, tag_id)
  VALUES (1, 1);
INSERT INTO colors_tags (color_id, tag_id)
  VALUES (5, 2);
INSERT INTO colors_tags (color_id, tag_id)
  VALUES (1, 3);
INSERT INTO colors_tags (color_id, tag_id)
  VALUES (3, 1);
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
