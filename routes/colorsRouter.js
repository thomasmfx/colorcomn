const Router = require('express');

const colorsController = require('../controllers/colorsController');

const colorsRouter = Router();

colorsRouter.get('/', colorsController.getAllColors);
colorsRouter.get('/:id', colorsController.getColor);
colorsRouter.get('/new', colorsController.createColorGet);
colorsRouter.post('/', colorsController.createColor);
colorsRouter.put('/:id', colorsController.updateColor);
colorsRouter.delete('/:id', colorsController.deleteColor);

module.exports = colorsRouter;
