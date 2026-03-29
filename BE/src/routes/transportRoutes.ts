import express from 'express';
import {
  getTransports,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport
} from '../controllers/transportController';

const router = express.Router();

router.route('/')
  .get(getTransports)
  .post(createTransport);

router.route('/:id')
  .get(getTransportById)
  .put(updateTransport)
  .delete(deleteTransport);

export default router;