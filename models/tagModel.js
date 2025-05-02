const db = require('../db/pool');

// || Tags
async function getAllTags() {
  const { rows } = await db.query(`
    SELECT * FROM tags;
  `);

  return rows;
}

async function getTagById(id) {
  const { rows } = await db.query(
    `
    SELECT * FROM tags WHERE id = $1;
  `,
    [id],
  );

  return rows;
}

async function getAllColorsForTag(tagId) {
  const { rows } = await db.query(
    `
      SELECT c.id         AS color_id,
             c.name       AS color_name,
             c.code       AS color_code,
             c.created_at AS color_created_at
      FROM colors c
               JOIN colors_tags ct ON c.id = ct.color_id
               JOIN tags t ON ct.tag_id = t.id
      WHERE t.id = $1;
  `,
    [tagId],
  );

  return rows;
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
      unnest($2::int[]) AS color_id_value;
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
  getAllColorsForTag,
  insertTag,
  updateTagById,
  deleteTagById,
};
