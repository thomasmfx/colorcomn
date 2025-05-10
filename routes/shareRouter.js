const Router = require('express');

const shareController = require('../controllers/shareController');
const shareRouter = Router();

shareRouter.get('/color', shareController.getShareColorPage);
shareRouter.get('/', shareController.getSharePage);

module.exports = shareRouter;
