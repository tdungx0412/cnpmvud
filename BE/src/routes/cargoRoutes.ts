import express from 'express';
import {
  getCargos,
  getCargoById,
  createCargo,
  updateCargo,
  deleteCargo
} from '../controllers/cargoController';

const router = express.Router();

router.route('/')
  .get(getCargos)
  .post(createCargo);

router.route('/:id')
  .get(getCargoById)
  .put(updateCargo)
  .delete(deleteCargo);

export default router;