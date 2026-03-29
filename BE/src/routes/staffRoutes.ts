import express from 'express';
import {
  getStaffs,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff
} from '../controllers/staffController';

const router = express.Router();

router.route('/')
  .get(getStaffs)
  .post(createStaff);

router.route('/:id')
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff);

export default router;