import { Request, Response } from 'express';
import Staff from '../models/Staff';

export const getStaffs = async (req: Request, res: Response): Promise<void> => {
  try {
    const staffs = await Staff.find();
    res.json({ success: true, count: staffs.length, data: staffs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, contact, status } = req.body;
    const staff = await Staff.create({ name, role, contact, status });
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    res.json({ success: true, message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};