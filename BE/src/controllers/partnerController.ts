import { Request, Response } from 'express';
import { poolPromise } from '../config/database';

// GET all partners
export const getPartners = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Partners ORDER BY CreatedAt DESC');
    res.json({ success: true, count: result.recordset.length, data: result.recordset });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET partner by ID
export const getPartnerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', req.params.id)
      .query('SELECT * FROM Partners WHERE Id = @id');
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Partner not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CREATE new partner
export const createPartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, contact, status } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('name', name)
      .input('type', type)
      .input('contact', contact)
      .input('status', status)
      .query(`
        INSERT INTO Partners (Name, Type, Contact, Status)
        OUTPUT INSERTED.*
        VALUES (@name, @type, @contact, @status)
      `);
    
    res.status(201).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE partner
export const updatePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, contact, status } = req.body;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', req.params.id)
      .input('name', name)
      .input('type', type)
      .input('contact', contact)
      .input('status', status)
      .query(`
        UPDATE Partners 
        SET Name = @name, Type = @type, Contact = @contact, Status = @status, UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id
      `);
    
    if (result.recordset.length === 0) {
      res.status(404).json({ success: false, message: 'Partner not found' });
      return;
    }
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE partner
export const deletePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Partners WHERE Id = @id');
    
    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ success: false, message: 'Partner not found' });
      return;
    }
    res.json({ success: true, message: 'Partner deleted' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};