import { Request, Response } from 'express';
import Cargo from '../models/Cargo';

export const getCargos = async (req: Request, res: Response): Promise<void> => {
  try {
    const cargos = await Cargo.find();
    res.json({ success: true, count: cargos.length, data: cargos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCargoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cargo = await Cargo.findById(req.params.id);
    if (!cargo) {
      res.status(404).json({ success: false, message: 'Cargo not found' });
      return;
    }
    res.json({ success: true, data: cargo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, weight, type, containerId } = req.body;
    const cargo = await Cargo.create({ description, weight, type, containerId });
    res.status(201).json({ success: true, data: cargo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const cargo = await Cargo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!cargo) {
      res.status(404).json({ success: false, message: 'Cargo not found' });
      return;
    }
    res.json({ success: true, data: cargo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const cargo = await Cargo.findByIdAndDelete(req.params.id);
    if (!cargo) {
      res.status(404).json({ success: false, message: 'Cargo not found' });
      return;
    }
    res.json({ success: true, message: 'Cargo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};