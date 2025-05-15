const getRelativeDate = require('../utils/getRelativeDate');
const paletteModel = require('../models/paletteModel');

async function getAllPalettes(req, res) {
  const palettes = await paletteModel.getAllPalettes();

  res.render('palettes', {
    palettes: palettes,
  });
}

async function getPalette(req, res) {
  const palette = await paletteModel.getPaletteById(req.params.id);

  res.render('palette-details', {
    palette: palette,
    getRelativeDate,
  });
}

module.exports = {
  getAllPalettes,
  getPalette,
};
