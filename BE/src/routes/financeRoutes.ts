import express from 'express';
import {
  getFinances,
  getFinanceById,
  createFinance,
  updateFinance,
  deleteFinance
} from '../controllers/financeController';

const router = express.Router();

router.route('/')
  .get(getFinances)
  .post(createFinance);

router.route('/:id')
  .get(getFinanceById)
  .put(updateFinance)
  .delete(deleteFinance);

export default router;