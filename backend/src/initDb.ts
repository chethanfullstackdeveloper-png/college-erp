import { pool } from "./db";

type Table = "students" | "admins" | "teachers";

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id SERIAL PRIMARY KEY,
      staff_id TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      subject TEXT,
      division TEXT,
      address TEXT,
      date_of_birth DATE,
      phone_number TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      roll_number TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      year TEXT NOT NULL,
      stream TEXT NOT NULL,
      branch TEXT NOT NULL,
      address TEXT,
      date_of_birth DATE,
      phone_number TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("ADMIN_EMAIL and ADMIN_PASSWORD not set; skipping admin seed.");
    return;
  }

  const result = await pool.query("SELECT id FROM admins WHERE email = $1", [
    adminEmail,
  ]);
  if (result.rows.length === 0) {
    await pool.query("INSERT INTO admins (email, password) VALUES ($1, $2)", [
      adminEmail,
      adminPassword,
    ]);
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists:", adminEmail);
  }
}

async function seedStaff() {
  const staffEmail = process.env.STAFF_EMAIL || "staff@example.com";
  const staffPassword = process.env.STAFF_PASSWORD || "staff123";

  const result = await pool.query("SELECT id FROM teachers WHERE email = $1", [
    staffEmail,
  ]);
  if (result.rows.length === 0) {
    await pool.query(
      "INSERT INTO teachers (staff_id, name, email, password, subject) VALUES ($1, $2, $3, $4, $5)",
      ["STAFF001", "Default Staff", staffEmail, staffPassword, "Mathematics"],
    );
    console.log("Staff user created:", staffEmail);
  } else {
    console.log("Staff user already exists:", staffEmail);
  }
}

async function seedStudent() {
  const studentEmail = process.env.STUDENT_EMAIL || "student@example.com";
  const studentPassword = process.env.STUDENT_PASSWORD || "student123";

  const result = await pool.query("SELECT id FROM students WHERE email = $1", [
    studentEmail,
  ]);
  if (result.rows.length === 0) {
    await pool.query(
      "INSERT INTO students (roll_number, name, email, password, year, stream, branch) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        "STU001",
        "Default Student",
        studentEmail,
        studentPassword,
        "1",
        "Science",
        "PCMB",
      ],
    );
    console.log("Student user created:", studentEmail);
  } else {
    console.log("Student user already exists:", studentEmail);
  }
}

async function init() {
  try {
    await createTables();
    await seedAdmin();
    await seedStaff();
    await seedStudent();
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
