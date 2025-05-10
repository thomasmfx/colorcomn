const getRelativeDate = require('../utils/getRelativeDate');
const colorModel = require('../models/colorModel');

async function getAllColors(req, res) {
  const colors = await colorModel.getAllColors();

  res.render('colors', {
    colors: colors,
  });
}

async function getColor(req, res) {
  const color = await colorModel.getColorById(req.params.id);

  res.render('color-details', {
    color: color,
    getRelativeDate,
  });
}

async function createColor(req, res) {
  const { name, code, tags } = req.body;

  const uppercasedCode = `#${code.substring(1).toUpperCase()}`;
  const parsedTags = JSON.parse(tags).map((tag) => tag.id);

  const returnedId = await colorModel.insertColor(
    name,
    uppercasedCode,
    parsedTags,
  );

  res.redirect(`/colors/${returnedId}`);
}

async function updateColor(req, res) {
  const { id, name, code, tags } = req.body;
  const jsonTags = JSON.stringify(tags);

  await colorModel.updateColor(id, name, code, jsonTags);

  res.redirect('/colors');
}

async function deleteColor(req, res) {
  const { id } = req.params;
  await colorModel.deleteColor(id);

  res.redirect('/colors');
}

module.exports = {
  getAllColors,
  getColor,
  createColor,
  updateColor,
  deleteColor,
};
