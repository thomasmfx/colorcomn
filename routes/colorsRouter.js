const Router = require('express');

const colorsController = require('../controllers/colorsController');

const colorsRouter = Router();

colorsRouter.get('/:id', colorsController.getColor);
colorsRouter.get('/', colorsController.getAllColors);
colorsRouter.post('/', colorsController.createColor);
colorsRouter.put('/:id', colorsController.updateColor);
colorsRouter.delete('/:id', colorsController.deleteColor);

module.exports = colorsRouter;
