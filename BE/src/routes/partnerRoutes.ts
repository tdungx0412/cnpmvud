import express from 'express';
import {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partnerController';

const router = express.Router();

router.route('/')
  .get(getPartners)
  .post(createPartner);

router.route('/:id')
  .get(getPartnerById)
  .put(updatePartner)
  .delete(deletePartner);

export default router;