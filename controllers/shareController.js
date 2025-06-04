const colorModel = require('../models/colorModel');
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

async function getShareTagPage(req, res) {
  const colors = await colorModel.getAllColors();

  res.render('share-tag', {
    colors: colors,
  });
}

async function getSharePalettePage(req, res) {
  const colors = await colorModel.getAllColors();

  res.render('share-palette', {
    colors: colors,
  });
}

module.exports = {
  getSharePage,
  getShareColorPage,
  getShareTagPage,
  getSharePalettePage,
};
