import dotenv from "dotenv";
import { Pool as PgPool } from "pg";
import { newDb } from "pg-mem";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const localDatabaseUrl =
  databaseUrl?.includes("localhost") || databaseUrl?.includes("127.0.0.1");

let activePool: any;
let activePoolName = "postgres";

function createPgPool() {
  return new PgPool({
    connectionString: databaseUrl,
    ssl: localDatabaseUrl ? undefined : { rejectUnauthorized: false },
  });
}

async function createMemoryPool() {
  console.warn(
    "⚠️ Database fallback: Postgres unreachable, using in-memory database.",
  );

  const memoryDb = newDb();
  const pg = memoryDb.adapters.createPg();
  const pool = new pg.Pool();

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

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const staffEmail = process.env.STAFF_EMAIL || "staff@example.com";
  const staffPassword = process.env.STAFF_PASSWORD || "staff123";
  const studentEmail = process.env.STUDENT_EMAIL || "student@example.com";
  const studentPassword = process.env.STUDENT_PASSWORD || "student123";

  const existingAdmin = await pool.query(
    "SELECT id FROM admins WHERE email = $1",
    [adminEmail],
  );
  if (existingAdmin.rows.length === 0) {
    await pool.query("INSERT INTO admins (email, password) VALUES ($1, $2)", [
      adminEmail,
      adminPassword,
    ]);
    console.warn(`⚠️ Seeded admin user for in-memory fallback: ${adminEmail}`);
  }

  const existingStaff = await pool.query(
    "SELECT id FROM teachers WHERE email = $1",
    [staffEmail],
  );
  if (existingStaff.rows.length === 0) {
    await pool.query(
      "INSERT INTO teachers (staff_id, name, email, password, subject) VALUES ($1, $2, $3, $4, $5)",
      ["STAFF001", "Default Staff", staffEmail, staffPassword, "Mathematics"],
    );
    console.warn(`⚠️ Seeded staff user for in-memory fallback: ${staffEmail}`);
  }

  const existingStudent = await pool.query(
    "SELECT id FROM students WHERE email = $1",
    [studentEmail],
  );
  if (existingStudent.rows.length === 0) {
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
    console.warn(
      `⚠️ Seeded student user for in-memory fallback: ${studentEmail}`,
    );
  }

  return pool;
}

function isConnectionError(error: any) {
  if (!error) return false;

  return (
    ["ENOTFOUND", "ECONNREFUSED", "EAI_AGAIN", "ECONNRESET"].includes(
      error.code,
    ) ||
    /getaddrinfo|connection.*failed|could not connect/i.test(
      error.message || "",
    )
  );
}

function normalizeResult(result: any) {
  if (!result) {
    return { rows: [], rowCount: 0 };
  }

  if (!Object.prototype.hasOwnProperty.call(result, "rows")) {
    result.rows = [];
  }

  if (!Object.prototype.hasOwnProperty.call(result, "rowCount")) {
    result.rowCount = Array.isArray(result.rows) ? result.rows.length : 0;
  }

  return result;
}

async function ensurePool() {
  if (activePool) {
    return activePool;
  }

  if (databaseUrl) {
    activePool = createPgPool();
    activePoolName = "postgres";
    return activePool;
  }

  activePool = await createMemoryPool();
  activePoolName = "memory";
  return activePool;
}

export const pool = {
  query: async (sql: string, params?: any[]) => {
    const pool = await ensurePool();

    try {
      const result = await pool.query(sql, params);
      return normalizeResult(result);
    } catch (error: any) {
      if (activePoolName === "postgres" && isConnectionError(error)) {
        activePool = await createMemoryPool();
        activePoolName = "memory";
        const result = await activePool.query(sql, params);
        return normalizeResult(result);
      }
      throw error;
    }
  },
  end: async () => {
    if (activePool && typeof activePool.end === "function") {
      await activePool.end();
    }
  },
};
