const Router = require('express');

const colorsController = require('../controllers/colorsController');

const colorsRouter = Router();

colorsRouter.get('/', colorsController.getColorsList);

module.exports = colorsRouter;
