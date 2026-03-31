import { Request, Response } from 'express';
import { poolPromise } from '../config/database';

export const getStaffs = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Staff ORDER BY CreatedAt DESC');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT * FROM Staff WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, contact, status } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('name', name)
      .input('role', role)
      .input('contact', contact)
      .input('status', status)
      .query(`
        INSERT INTO Staff (Name, Role, Contact, Status)
        OUTPUT INSERTED.*
        VALUES (@name, @role, @contact, @status)
      `);
    
    res.status(201).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, contact, status } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', req.params.id)
      .input('name', name)
      .input('role', role)
      .input('contact', contact)
      .input('status', status)
      .query(`
        UPDATE Staff 
        SET Name = @name, Role = @role, Contact = @contact, Status = @status, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Staff WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    res.json({ success: true, message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};