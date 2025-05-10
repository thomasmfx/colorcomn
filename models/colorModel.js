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
      SELECT
        c.id,
        c.name,
        c.code,
        c.created_at,
        COALESCE(
          (SELECT jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name))
            FROM tags t
            JOIN colors_tags ct ON t.id = ct.tag_id
            WHERE ct.color_id = c.id),
            '[]'::jsonb
        ) AS tags,
        COALESCE(
          (SELECT jsonb_agg(jsonb_build_object(
            'id', p.id,
            'name', p.name,
            'description', p.description
          ))
          FROM palettes p
          JOIN colors_palettes cp ON p.id = cp.palette_id
          WHERE cp.color_id = c.id),
          '[]'::jsonb
        ) AS palettes
      FROM colors c
      WHERE c.id = $1
      GROUP BY c.id;
    `,
    [id],
  );

  return rows.length > 0 ? rows[0] : null;
}

async function insertColor(name, code, tags) {
  const { rows } = await db.query(
    `
    WITH new_color AS (
      INSERT INTO colors (name, code, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id
    ),
    tag_insertion AS (
      INSERT INTO colors_tags (color_id, tag_id)
      SELECT
        nc.id,
        tag_id_value
      FROM
        new_color nc,
        unnest($3::int[]) AS tag_id_value
      RETURNING color_id
    )
    SELECT id FROM new_color
  `,
    [name, code, tags],
  );

  return rows[0].id;
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
  insertColor,
  updateColor,
  deleteColor,
};
