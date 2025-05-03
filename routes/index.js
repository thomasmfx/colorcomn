const colorsRouter = require('./colorsRouter');
const shareRouter = require('./shareRouter');
const indexRouter = require('./indexRouter');

module.exports = {
  index: indexRouter,
  share: shareRouter,
  colors: colorsRouter,
};
