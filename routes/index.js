const colorsRouter = require('./colorsRouter');
const shareRouter = require('./shareRouter');
const indexRouter = require('./indexRouter');
const tagsRouter = require('./tagsRouter');

module.exports = {
  index: indexRouter,
  share: shareRouter,
  colors: colorsRouter,
  tags: tagsRouter,
};
