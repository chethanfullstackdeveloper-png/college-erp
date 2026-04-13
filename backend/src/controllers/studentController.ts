import { Request, Response } from 'express';
import { pool } from '../db';

// Login Student
export const loginStudent = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, roll_number, name, email, year, stream, branch FROM students WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid student credentials' });
    }

    res.json({ student: result.rows[0] });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ error: 'Student login failed' });
  }
};

// Get Student Profile
export const getStudentProfile = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student: result.rows[0] });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ error: 'Failed to fetch student profile' });
  }
};

// Update Student Profile (name, email, roll_number)
export const updateStudentProfile = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { name, email, roll_number } = req.body;

  if (!name || !email || !roll_number) {
    return res.status(400).json({ message: 'Name, email, and roll number are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE students SET name = $1, email = $2, roll_number = $3 WHERE id = $4 RETURNING *',
      [name, email, roll_number, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email or roll number already exists' });
    }
    console.error('Update student profile error:', error);
    res.status(500).json({ error: 'Failed to update student profile' });
  }
};

// Add Single Student
export const addStudent = async (req: Request, res: Response) => {
  const { roll_number, name, email, password, year, stream, branch } = req.body;

  if (!roll_number || !name || !email || !password || !year || !stream || !branch) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO students (roll_number, name, email, password, year, stream, branch) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [roll_number, name, email, password, year, stream, branch]
    );

    res.status(201).json({ student: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Roll number or email already exists' });
    }
    console.error('Add student error:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
};

// Bulk Add Students via Excel
export const bulkAddStudents = async (req: Request, res: Response) => {
  const studentList = req.body; // Array of student objects

  if (!Array.isArray(studentList) || studentList.length === 0) {
    return res.status(400).json({ message: 'Student list is required' });
  }

  try {
    const results = [];
    const errors = [];

    for (let i = 0; i < studentList.length; i++) {
      const { roll_number, name, email, password, year, stream, branch } = studentList[i];

      if (!roll_number || !name || !email || !password || !year || !stream || !branch) {
        errors.push({ row: i + 1, message: 'Missing required fields' });
        continue;
      }

      try {
        const result = await pool.query(
          'INSERT INTO students (roll_number, name, email, password, year, stream, branch) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, roll_number, name, email, year, stream, branch',
          [roll_number, name, email, password, year, stream, branch]
        );
        results.push(result.rows[0]);
      } catch (err: any) {
        console.error(`Error inserting student row ${i + 1}:`, err);
        if (err.code === '23505') {
          errors.push({ row: i + 1, roll_number, message: 'Roll number or email already exists' });
        } else {
          errors.push({ row: i + 1, roll_number, message: err.message || 'Failed to insert student' });
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
    console.error('Bulk add students error:', error);
    res.status(500).json({ error: 'Failed to bulk add students' });
  }
};

// Get all students (for admin)
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, roll_number, name, email, year, stream, branch, created_at FROM students ORDER BY created_at DESC');
    res.json({ students: result.rows, total: result.rows.length });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};
