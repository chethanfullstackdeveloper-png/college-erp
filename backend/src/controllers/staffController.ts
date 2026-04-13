import { Request, Response } from 'express';
import { pool } from '../db';

// Login Staff
export const loginStaff = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, subject FROM teachers WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid staff credentials' });
    }

    res.json({ staff: result.rows[0] });
  } catch (error) {
    console.error('Staff login error:', error);
    res.status(500).json({ error: 'Staff login failed' });
  }
};

// Get Staff Profile
export const getStaffProfile = async (req: Request, res: Response) => {
  const { staffId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM teachers WHERE id = $1',
      [staffId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ staff: result.rows[0] });
  } catch (error) {
    console.error('Get staff profile error:', error);
    res.status(500).json({ error: 'Failed to fetch staff profile' });
  }
};

// Update Staff Profile (name, email, subject)
export const updateStaffProfile = async (req: Request, res: Response) => {
  const { staffId } = req.params;
  const { name, email, subject } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE teachers SET name = $1, email = $2, subject = $3 WHERE id = $4 RETURNING *',
      [name, email, subject || null, staffId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({ staff: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Update staff profile error:', error);
    res.status(500).json({ error: 'Failed to update staff profile' });
  }
};

// Add Staff via Excel Import
export const addStaff = async (req: Request, res: Response) => {
  const { name, email, password, subject } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields: name, email, password, subject' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO teachers (name, email, password, subject) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, subject || null]
    );

    res.status(201).json({ staff: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Add staff error:', error);
    res.status(500).json({ error: 'Failed to add staff' });
  }
};

// Bulk Add Staff via Excel
export const bulkAddStaff = async (req: Request, res: Response) => {
  const staffList = req.body; // Array of staff objects
  
  console.log('Bulk add staff request received:', JSON.stringify(staffList));

  if (!Array.isArray(staffList) || staffList.length === 0) {
    return res.status(400).json({ message: 'Staff list is required' });
  }

  try {
    const results = [];
    const errors = [];

    for (let i = 0; i < staffList.length; i++) {
      const { name, email, password, subject } = staffList[i];

      if (!name || !email || !password) {
        errors.push({ row: i + 1, message: 'Missing required fields: name, email, password' });
        continue;
      }

      try {
        const result = await pool.query(
          'INSERT INTO teachers (name, email, password, subject) VALUES ($1, $2, $3, $4) RETURNING id, name, email, subject',
          [name, email, password, subject || null]
        );
        results.push(result.rows[0]);
      } catch (err: any) {
        const errorMsg = err.message || err.detail || JSON.stringify(err);
        console.error(`Error inserting staff row ${i + 1}:`, errorMsg);
        if (err.code === '23505') {
          errors.push({ row: i + 1, email, message: 'Email already exists' });
        } else {
          errors.push({ row: i + 1, email, message: errorMsg, code: err.code });
        }
      }
    }

    res.status(201).json({
      imported: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Bulk add staff error:', error);
    res.status(500).json({ error: 'Failed to bulk add staff' });
  }
};
