const Router = require('express');

const palettesController = require('../controllers/palettesController');

const palettesRouter = Router();

palettesRouter.get('/:id', palettesController.getPalette);
palettesRouter.get('/', palettesController.getAllPalettes);
palettesRouter.post('/', palettesController.insertPalette);

module.exports = palettesRouter;
