const Router = require('express');

const shareController = require('../controllers/shareController');
const shareRouter = Router();

shareRouter.get('/palette', shareController.getSharePalettePage);
shareRouter.get('/color', shareController.getShareColorPage);
shareRouter.get('/tag', shareController.getShareTagPage);
shareRouter.get('/', shareController.getSharePage);

module.exports = shareRouter;
