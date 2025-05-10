const Router = require('express');

const tagsController = require('../controllers/tagsController');
const tagsRouter = Router();
tagsRouter.get('/:id', tagsController.getTag);
tagsRouter.get('/', tagsController.getAllTags);
module.exports = tagsRouter;
