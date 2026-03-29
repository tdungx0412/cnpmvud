import { Request, Response } from 'express';
import { poolPromise } from '../config/database';

export const getContainers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Containers ORDER BY CreatedAt DESC');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (error) {
    console.error('Error fetching containers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getContainerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT * FROM Containers WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Container not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createContainer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { number, type, location, status } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('number', number)
      .input('type', type)
      .input('location', location)
      .input('status', status)
      .query(`
        INSERT INTO Containers (Number, Type, Location, Status)
        OUTPUT INSERTED.*
        VALUES (@number, @type, @location, @status)
      `);
    res.status(201).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Error creating container:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateContainer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { number, type, location, status } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .input('number', number)
      .input('type', type)
      .input('location', location)
      .input('status', status)
      .query(`
        UPDATE Containers 
        SET Number = @number, Type = @type, Location = @location, Status = @status, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Container not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteContainer = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Containers WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ success: false, message: 'Container not found' });
      return;
    }
    res.json({ success: true, message: 'Container deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};