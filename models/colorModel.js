const db = require('../db/pool');

async function getAllColors() {
  const { rows } = await db.query(`
    SELECT * FROM colors;
  `);

  return rows;
}

async function getColorById(id) {
  const { rows } = await db.query(
    `
    SELECT * FROM colors WHERE id = $1;
  `,
    [id],
  );

  return rows;
}

async function getAllTagsForColor(colorId) {
  const { rows } = await db.query(
    `
    SELECT t.id         AS tag_id,
           t.name       AS tag_name,
           t.created_at AS tag_created_at
    FROM tags t
             JOIN colors_tags ct ON t.id = ct.tag_id
             JOIN colors c ON ct.color_id = c.id
    WHERE c.id = $1;
  `,
    [colorId],
  );

  return rows;
}

async function getAllPalettesForColor(colorId) {
  const { rows } = await db.query(
    `
    SELECT
      p.id AS palette_id,
      p.name AS palette_name,
      p.description AS palette_description,
      p.created_at AS palette_created_at,
      jsonb_agg(jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'code', c.code,
        'created_at', c.created_at,
        'position', cp.color_position
      ) ORDER BY cp.color_position) AS colors
    FROM palettes p
    JOIN colors_palettes cp ON p.id = cp.palette_id
    JOIN colors c ON c.id = cp.color_id
    WHERE c.id = $1
    GROUP BY p.id, p.name, p.description, p.created_at;
  `,
    [colorId],
  );

  return rows;
}

async function insertColor(name, code, tags) {
  const { rows } = await db.query(
    `
    WITH new_color AS (
      INSERT INTO colors (name, code, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id
    )
    INSERT INTO colors_tags (color_id, tag_id)
    SELECT
      nc.id,        
      tag_id_value
    FROM
      new_color nc,     
      unnest($3::int[]) AS tag_id_value;
  `,
    [name, code, tags],
  );

  return rows;
}

async function updateColor(id, name, code, tags) {
  const { rows } = await db.query(
    `
    BEGIN;

    -- 1. Update color metadata
    UPDATE colors 
    SET 
      name = COALESCE($2, name), 
      code = COALESCE($3, code) 
    WHERE id = $1;

    -- 2. Delete old tag associations
    DELETE FROM colors_tags WHERE color_id = $1;

    -- 3. Insert new tag associations
    INSERT INTO colors_tags (color_id, tag_id)
    SELECT
      $1,
      tag_id_value
    FROM
      unnest($4::int[]) AS tag_id_value;

    COMMIT;
  `,
    [id, name, code, tags],
  );

  return rows;
}
async function deleteColor(id) {
  const { rows } = await db.query(
    `
    DELETE FROM colors
    WHERE id = $1;
  `,
    [id],
  );

  return rows;
}

module.exports = {
  getAllColors,
  getColorById,
  getAllTagsForColor,
  getAllPalettesForColor,
  insertColor,
  updateColor,
  deleteColor,
};
