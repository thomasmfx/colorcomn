const getRelativeDate = require('../utils/getRelativeDate');
const tagModel = require('../models/tagModel');

async function getAllTags(req, res) {
  const tags = await tagModel.getAllTags();

  res.render('tags', {
    tags: tags,
  });
}

async function getTag(req, res) {
  const tag = await tagModel.getTagById(req.params.id);

  res.render('tag-details', {
    tag: tag,
    getRelativeDate,
  });
}

async function createTag(req, res) {
  const { name, colors } = req.body;

  const parsedColors = JSON.parse(colors).map((color) => parseInt(color));

  const returnedId = await tagModel.insertTag(name, parsedColors);

  res.redirect(`/tags/${returnedId}`);
}

module.exports = {
  getAllTags,
  getTag,
  createTag,
};
