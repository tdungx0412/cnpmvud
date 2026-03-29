import { Request, Response } from 'express';
import Contract from '../models/Contract';

export const getContracts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contracts = await Contract.find();
    res.json({ success: true, count: contracts.length, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getContractById = async (req: Request, res: Response): Promise<void> => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      res.status(404).json({ success: false, message: 'Contract not found' });
      return;
    }
    res.json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractNo, partnerName, startDate, endDate, value, status, note } = req.body;
    const contract = await Contract.create({ contractNo, partnerName, startDate, endDate, value, status, note });
    res.status(201).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!contract) {
      res.status(404).json({ success: false, message: 'Contract not found' });
      return;
    }
    res.json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) {
      res.status(404).json({ success: false, message: 'Contract not found' });
      return;
    }
    res.json({ success: true, message: 'Contract deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};