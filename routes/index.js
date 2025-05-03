const indexRouter = require('./indexRouter');
const shareRouter = require('./shareRouter');
const colorsRouter = require('./colorsRouter');

module.exports = {
  index: indexRouter,
  share: shareRouter,
  colors: colorsRouter,
};
