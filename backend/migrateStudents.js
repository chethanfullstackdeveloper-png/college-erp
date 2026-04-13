const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateSchema() {
  try {
    // Drop the old students table and recreate with correct schema
    console.log('Dropping old students table...');
    await pool.query('DROP TABLE IF EXISTS students');

    console.log('Creating new students table with correct schema...');
    await pool.query(`
      CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        roll_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        year VARCHAR(50) NOT NULL,
        stream VARCHAR(50) NOT NULL,
        branch VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Students table recreated successfully with correct schema');
    console.log('Columns: id, roll_number, name, email, password, year, stream, branch');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

migrateSchema();
