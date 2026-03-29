import express from 'express';
import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partnerController';

const router = express.Router();

router.route('/')
  .get(getPartners)
  .post(createPartner);

router.route('/:id')
  .put(updatePartner)
  .delete(deletePartner);

export default router;