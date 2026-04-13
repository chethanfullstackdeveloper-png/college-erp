import { pool } from './src/db';

(async () => {
  try {
    // Test insert
    const result = await pool.query(
      'INSERT INTO teachers (name, email, password, subject) VALUES ($1, $2, $3, $4) RETURNING *',
      ['John Doe', 'john.test@example.com', 'test123', 'Mathematics']
    );
    console.log('✓ Insert successful:', result.rows[0]);
    process.exit(0);
  } catch (err: any) {
    console.error('✗ Insert failed:', err.message);
    process.exit(1);
  }
})();
