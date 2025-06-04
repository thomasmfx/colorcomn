const db = require('../db/pool');

async function getAllPalettes() {
  const { rows } = await db.query(`
    SELECT
      p.id AS id,
      p.name AS name,
      p.description AS description,
      p.created_at AS created_at,
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
    GROUP BY p.id, p.name, p.description, p.created_at;
  `);

  return rows;
}

async function getPaletteById(id) {
  const { rows } = await db.query(
    `
    SELECT
      p.id AS id,
      p.name AS name,
      p.description AS description,
      p.created_at AS created_at,
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
    WHERE p.id = $1
    GROUP BY p.id, p.name, p.description, p.created_at;
  `,
    [id],
  );

  return rows[0];
}

async function insertPalette(name, description, colors) {
  const { rows } = await db.query(
    `
    WITH new_palette AS (
      INSERT INTO palettes (name, description, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id
    ),
    color_insertion AS (
      INSERT INTO colors_palettes (color_id, palette_id, color_position)
      SELECT
        (elem->>'id')::int AS color_id,
        np.id AS palette_id,
        (elem->>'position')::int AS color_position
      FROM
        new_palette np,
        jsonb_array_elements($3::jsonb) AS elem
    ) 
    SELECT id from new_palette;
  `,
    [name, description, colors],
  );

  return rows[0].id;
}

async function updatePaletteById(id, name, description, colors) {
  const { rows } = await db.query(
    `
    BEGIN;

    -- 1. Update palette metadata
    UPDATE palettes 
    SET 
      name = COALESCE($2, name), 
      description = COALESCE($3, description) 
    WHERE id = $1;

    -- 2. Delete old color associations
    DELETE FROM colors_palettes WHERE palette_id = $1;

    -- 3. Insert new color associations
    INSERT INTO colors_palettes (color_id, palette_id, color_position)
    SELECT
      (elem->>'color_id')::int AS color_id,
      $1 AS palette_id,
      (elem->>'position')::int AS color_position
    FROM
      jsonb_array_elements($4::jsonb) AS elem;

    COMMIT;
  `,
    [id, name, description, colors],
  );

  return rows;
}

async function deletePaletteById(id) {
  const { rows } = await db.query(
    `
    DELETE FROM palettes
    WHERE id = $1;
  `,
    [id],
  );

  return rows;
}

module.exports = {
  getAllPalettes,
  getPaletteById,
  insertPalette,
  updatePaletteById,
  deletePaletteById,
};
