import { Request, Response } from 'express';
import Invoice from '../models/Invoice';

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await Invoice.find();
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceNo, contractId, containerId, partnerName, issueDate, dueDate, amount, vat, status, paidDate, note } = req.body;
    const total = amount + (amount * (vat || 10) / 100);
    const invoice = await Invoice.create({ invoiceNo, contractId, containerId, partnerName, issueDate, dueDate, amount, vat, total, status, paidDate, note });
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, vat } = req.body;
    const total = (amount || 0) + ((amount || 0) * ((vat || 10)) / 100);
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { ...req.body, total }, {
      new: true,
      runValidators: true
    });
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};