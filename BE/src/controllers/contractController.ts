import { Request, Response } from 'express';
import { poolPromise } from '../config/database';

export const getContracts = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Contracts ORDER BY CreatedAt DESC');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getContractById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT * FROM Contracts WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Contract not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractNo, partnerId, startDate, endDate, value, status, note } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('contractNo', contractNo)
      .input('partnerId', partnerId)
      .input('startDate', startDate)
      .input('endDate', endDate)
      .input('value', value)
      .input('status', status)
      .input('note', note)
      .query(`
        INSERT INTO Contracts (ContractNo, PartnerId, StartDate, EndDate, Value, Status, Note)
        OUTPUT INSERTED.*
        VALUES (@contractNo, @partnerId, @startDate, @endDate, @value, @status, @note)
      `);
    
    res.status(201).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contractNo, partnerId, startDate, endDate, value, status, note } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', req.params.id)
      .input('contractNo', contractNo)
      .input('partnerId', partnerId)
      .input('startDate', startDate)
      .input('endDate', endDate)
      .input('value', value)
      .input('status', status)
      .input('note', note)
      .query(`
        UPDATE Contracts 
        SET ContractNo = @contractNo, PartnerId = @partnerId, StartDate = @startDate, EndDate = @endDate, Value = @value, Status = @status, Note = @note, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Contract not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Contracts WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ success: false, message: 'Contract not found' });
      return;
    }
    res.json({ success: true, message: 'Contract deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};