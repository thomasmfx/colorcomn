const tagModel = require('../models/tagModel');

async function getSharePage(req, res) {
  res.render('share');
}

async function getShareColorPage(req, res) {
  const tags = await tagModel.getAllTags();

  res.render('share-color', {
    tags: tags,
  });
}

module.exports = {
  getSharePage,
  getShareColorPage,
};
