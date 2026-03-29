import { Request, Response } from 'express';
import Finance from '../models/Finance';

export const getFinances = async (req: Request, res: Response): Promise<void> => {
  try {
    const finances = await Finance.find();
    res.json({ success: true, count: finances.length, data: finances });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getFinanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const finance = await Finance.findById(req.params.id);
    if (!finance) {
      res.status(404).json({ success: false, message: 'Finance not found' });
      return;
    }
    res.json({ success: true, data: finance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { containerId, baseCost, demDet, localCharge, extraCost } = req.body;
    const total = (baseCost || 0) + (demDet || 0) + (localCharge || 0) + (extraCost || 0);
    const finance = await Finance.create({ containerId, baseCost, demDet, localCharge, extraCost, total });
    res.status(201).json({ success: true, data: finance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { baseCost, demDet, localCharge, extraCost } = req.body;
    const total = (baseCost || 0) + (demDet || 0) + (localCharge || 0) + (extraCost || 0);
    const finance = await Finance.findByIdAndUpdate(req.params.id, { ...req.body, total }, {
      new: true,
      runValidators: true
    });
    if (!finance) {
      res.status(404).json({ success: false, message: 'Finance not found' });
      return;
    }
    res.json({ success: true, data: finance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    const finance = await Finance.findByIdAndDelete(req.params.id);
    if (!finance) {
      res.status(404).json({ success: false, message: 'Finance not found' });
      return;
    }
    res.json({ success: true, message: 'Finance deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};