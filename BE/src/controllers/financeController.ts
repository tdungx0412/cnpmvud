import { Request, Response } from 'express';
import { poolPromise } from '../config/database';

export const getFinances = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Finance ORDER BY CreatedAt DESC');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getFinanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT * FROM Finance WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Finance not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { containerId, baseCost, demDet, localCharge, extraCost } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('containerId', containerId)
      .input('baseCost', baseCost || 0)
      .input('demDet', demDet || 0)
      .input('localCharge', localCharge || 0)
      .input('extraCost', extraCost || 0)
      .query(`
        INSERT INTO Finance (ContainerId, BaseCost, DemDet, LocalCharge, ExtraCost)
        OUTPUT INSERTED.*
        VALUES (@containerId, @baseCost, @demDet, @localCharge, @extraCost)
      `);
    
    res.status(201).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { containerId, baseCost, demDet, localCharge, extraCost } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', req.params.id)
      .input('containerId', containerId)
      .input('baseCost', baseCost || 0)
      .input('demDet', demDet || 0)
      .input('localCharge', localCharge || 0)
      .input('extraCost', extraCost || 0)
      .query(`
        UPDATE Finance 
        SET ContainerId = @containerId, BaseCost = @baseCost, DemDet = @demDet, LocalCharge = @localCharge, ExtraCost = @extraCost, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Finance not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteFinance = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Finance WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ success: false, message: 'Finance not found' });
      return;
    }
    res.json({ success: true, message: 'Finance deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};