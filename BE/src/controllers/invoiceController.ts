import { Request, Response } from 'express';
import { poolPromise } from '../config/database';

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Invoices ORDER BY CreatedAt DESC');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT * FROM Invoices WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceNo, contractId, containerId, partnerId, issueDate, dueDate, amount, vat, status, paidDate, note } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('invoiceNo', invoiceNo)
      .input('contractId', contractId)
      .input('containerId', containerId)
      .input('partnerId', partnerId)
      .input('issueDate', issueDate)
      .input('dueDate', dueDate)
      .input('amount', amount)
      .input('vat', vat || 10)
      .input('status', status)
      .input('paidDate', paidDate)
      .input('note', note)
      .query(`
        INSERT INTO Invoices (InvoiceNo, ContractId, ContainerId, PartnerId, IssueDate, DueDate, Amount, Vat, Status, PaidDate, Note)
        OUTPUT INSERTED.*
        VALUES (@invoiceNo, @contractId, @containerId, @partnerId, @issueDate, @dueDate, @amount, @vat, @status, @paidDate, @note)
      `);
    
    res.status(201).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceNo, contractId, containerId, partnerId, issueDate, dueDate, amount, vat, status, paidDate, note } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', req.params.id)
      .input('invoiceNo', invoiceNo)
      .input('contractId', contractId)
      .input('containerId', containerId)
      .input('partnerId', partnerId)
      .input('issueDate', issueDate)
      .input('dueDate', dueDate)
      .input('amount', amount)
      .input('vat', vat || 10)
      .input('status', status)
      .input('paidDate', paidDate)
      .input('note', note)
      .query(`
        UPDATE Invoices 
        SET InvoiceNo = @invoiceNo, ContractId = @contractId, ContainerId = @containerId, PartnerId = @partnerId, IssueDate = @issueDate, DueDate = @dueDate, Amount = @amount, Vat = @vat, Status = @status, PaidDate = @paidDate, Note = @note, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Invoices WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};