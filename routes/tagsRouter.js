const Router = require('express');

const tagsController = require('../controllers/tagsController');

const tagsRouter = Router();

tagsRouter.get('/:id', tagsController.getTag);
tagsRouter.get('/', tagsController.getAllTags);
tagsRouter.post('/', tagsController.createTag);

module.exports = tagsRouter;
