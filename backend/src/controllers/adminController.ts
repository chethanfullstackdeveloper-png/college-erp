import fs from "fs";
import { Request, Response } from "express";
import { pool } from "../db";

export const loginAdmin = async (req: Request, res: Response) => {
  const requestBody = JSON.stringify(req.body);
  const requestMessage = `${new Date().toISOString()} loginAdmin request body: ${requestBody}\n`;
  fs.appendFileSync("./backend-debug.log", requestMessage);
  console.log("loginAdmin request body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, email FROM admins WHERE email = $1 AND password = $2",
      [email, password],
    );
    const resultMessage = `${new Date().toISOString()} loginAdmin query result rows: ${JSON.stringify(result.rows)}\n`;
    fs.appendFileSync("./backend-debug.log", resultMessage);
    console.log("loginAdmin query result rows:", result.rows);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.json({ admin: result.rows[0] });
  } catch (error: any) {
    const errorMessage = `${new Date().toISOString()} Admin login error: ${error?.message || JSON.stringify(error)}\n`;
    fs.appendFileSync("./backend-debug.log", errorMessage);
    console.error("Admin login error:", error);
    res
      .status(500)
      .json({ error: "Admin login failed", details: error?.message || error });
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, subject FROM teachers ORDER BY id DESC",
    );
    res.json({ staff: result.rows, total: result.rows.length });
  } catch (error) {
    console.error("Get all staff error:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, roll_number, name, email, year, stream, branch FROM students ORDER BY id DESC",
    );
    res.json({ students: result.rows, total: result.rows.length });
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  const { staffId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM teachers WHERE id = $1 RETURNING id",
      [staffId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({ error: "Failed to delete staff" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING id",
      [studentId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};
