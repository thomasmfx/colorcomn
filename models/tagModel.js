const db = require('../db/pool');

async function getAllTags() {
  const { rows } = await db.query(`
    SELECT * FROM tags;
  `);

  return rows;
}

async function getTagById(id) {
  const { rows } = await db.query(
    `
        SELECT
            t.id,
            t.name,
            t.created_at,
            COALESCE(
                    (SELECT jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'code', c.code))
                     FROM colors c
                              JOIN colors_tags ct ON c.id = ct.color_id
                     WHERE ct.tag_id = t.id),
                    '[]'::jsonb
            ) AS colors
        FROM tags t
        WHERE t.id = $1
        GROUP BY t.id;
    `,
    [id],
  );

  return rows[0];
}

async function insertTag(name, colors) {
  const { rows } = await db.query(
    `
    WITH new_tag AS (
      INSERT INTO tags (name, created_at)
      VALUES ($1, NOW())
      RETURNING id
    )
    INSERT INTO colors_tags (color_id, tag_id)
    SELECT        
      color_id_value,
      nt.id
    FROM
      new_tag nt,     
      unnest($2::int[]) AS color_id_value
    RETURNING nt.id; 
  `,
    [name, colors],
  );

  return rows;
}

async function updateTagById(id, name, colors) {
  const { rows } = await db.query(
    `
    BEGIN;

    -- 1. Update tag metadata
    UPDATE tags 
    SET 
      name = COALESCE($2, name)
    WHERE id = $1;

    -- 2. Delete old color associations
    DELETE FROM colors_tags WHERE tag_id = $1;

    -- 3. Insert new color associations
    INSERT INTO colors_tags (color_id, tag_id)
    SELECT
      color_id_value,
      $1
    FROM
      unnest($3::int[]) AS color_id_value;

    COMMIT;
  `,
    [id, name, colors],
  );

  return rows;
}

async function deleteTagById(id) {
  const { rows } = await db.query(
    `
    DELETE FROM tags
    WHERE id = $1;
  `,
    [id],
  );

  return rows;
}

module.exports = {
  getAllTags,
  getTagById,
  insertTag,
  updateTagById,
  deleteTagById,
};
