import { Request, Response } from 'express';
import Transport from '../models/Transport';

export const getTransports = async (req: Request, res: Response): Promise<void> => {
  try {
    const transports = await Transport.find();
    res.json({ success: true, count: transports.length, data: transports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getTransportById = async (req: Request, res: Response): Promise<void> => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      res.status(404).json({ success: false, message: 'Transport not found' });
      return;
    }
    res.json({ success: true, data: transport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refCode, containerId, vehicle, eta, status } = req.body;
    const transport = await Transport.create({ refCode, containerId, vehicle, eta, status });
    res.status(201).json({ success: true, data: transport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!transport) {
      res.status(404).json({ success: false, message: 'Transport not found' });
      return;
    }
    res.json({ success: true, data: transport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) {
      res.status(404).json({ success: false, message: 'Transport not found' });
      return;
    }
    res.json({ success: true, message: 'Transport deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};