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

module.exports = {
  getAllTags,
  getTag,
};
