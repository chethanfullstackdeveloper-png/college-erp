const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'students'
  ORDER BY ordinal_position
`, (err, res) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Students table columns:');
    console.log(JSON.stringify(res.rows, null, 2));
  }
  process.exit();
});
