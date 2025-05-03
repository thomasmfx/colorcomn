const Router = require('express');

const shareRouter = Router();

shareRouter.get('/', (req, res) => {
  res.render('share');
});

module.exports = shareRouter;
