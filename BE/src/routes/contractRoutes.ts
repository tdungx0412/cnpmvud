import express from 'express';
import {
  getContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract
} from '../controllers/contractController';

const router = express.Router();

router.route('/')
  .get(getContracts)
  .post(createContract);

router.route('/:id')
  .get(getContractById)
  .put(updateContract)
  .delete(deleteContract);

export default router;