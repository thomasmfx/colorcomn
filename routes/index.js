const palettesRouter = require('./palettesRouter');
const colorsRouter = require('./colorsRouter');
const indexRouter = require('./indexRouter');
const shareRouter = require('./shareRouter');
const tagsRouter = require('./tagsRouter');

module.exports = {
  index: indexRouter,
  share: shareRouter,
  colors: colorsRouter,
  tags: tagsRouter,
  palettes: palettesRouter,
};
