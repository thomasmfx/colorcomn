const colorModel = require('../models/colorModel');

async function getColorsList(req, res) {
  const colors = await colorModel.getAllColors();

  res.render('colors', {
    colors: colors,
  });
}

module.exports = {
  getColorsList,
};
