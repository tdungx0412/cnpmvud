import { Request, Response } from 'express';
import { poolPromise } from '../config/database';

export const getCargos = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Cargo ORDER BY CreatedAt DESC');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (error) {
    console.error('Error fetching cargo:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCargoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT * FROM Cargo WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Cargo not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, weight, type, containerId } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('description', description)
      .input('weight', weight)
      .input('type', type)
      .input('containerId', containerId)
      .query(`
        INSERT INTO Cargo (Description, Weight, Type, ContainerId)
        OUTPUT INSERTED.*
        VALUES (@description, @weight, @type, @containerId)
      `);
    
    res.status(201).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, weight, type, containerId } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', req.params.id)
      .input('description', description)
      .input('weight', weight)
      .input('type', type)
      .input('containerId', containerId)
      .query(`
        UPDATE Cargo 
        SET Description = @description, Weight = @weight, Type = @type, ContainerId = @containerId, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Cargo not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCargo = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Cargo WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ success: false, message: 'Cargo not found' });
      return;
    }
    res.json({ success: true, message: 'Cargo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};