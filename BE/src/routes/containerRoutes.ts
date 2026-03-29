import express from 'express';
import {
  getContainers,
  getContainerById,
  createContainer,
  updateContainer,
  deleteContainer
} from '../controllers/containerController';

const router = express.Router();

router.route('/')
  .get(getContainers)
  .post(createContainer);

router.route('/:id')
  .get(getContainerById)
  .put(updateContainer)
  .delete(deleteContainer);

export default router;