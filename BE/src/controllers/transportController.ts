import { Request, Response } from 'express';
import { poolPromise } from '../config/database';

export const getTransports = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Transport ORDER BY CreatedAt DESC');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getTransportById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT * FROM Transport WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Transport not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refCode, containerId, vehicle, eta, status } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('refCode', refCode)
      .input('containerId', containerId)
      .input('vehicle', vehicle)
      .input('eta', eta)
      .input('status', status)
      .query(`
        INSERT INTO Transport (RefCode, ContainerId, Vehicle, ETA, Status)
        OUTPUT INSERTED.*
        VALUES (@refCode, @containerId, @vehicle, @eta, @status)
      `);
    
    res.status(201).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refCode, containerId, vehicle, eta, status } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', req.params.id)
      .input('refCode', refCode)
      .input('containerId', containerId)
      .input('vehicle', vehicle)
      .input('eta', eta)
      .input('status', status)
      .query(`
        UPDATE Transport 
        SET RefCode = @refCode, ContainerId = @containerId, Vehicle = @vehicle, ETA = @eta, Status = @status, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Transport not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Transport WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ success: false, message: 'Transport not found' });
      return;
    }
    res.json({ success: true, message: 'Transport deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};