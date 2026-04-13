import { pool } from './db';

async function testDatabase() {
  try {
    console.log('\n=== Testing Database ===');

    // Test connection
    const timeResult = await pool.query('SELECT NOW()');
    console.log('✓ Database connected:', timeResult.rows[0]);

    // Check tables exist
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('✓ Tables in database:', tables.rows.map((r: any) => r.table_name));

    // Check teachers table schema
    const staffSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'teachers'
      ORDER BY ordinal_position
    `);
    console.log('✓ Teachers table columns:', staffSchema.rows);

    // Check existing staff data
    const staffCount = await pool.query('SELECT COUNT(*) FROM teachers');
    console.log('✓ Staff records in database:', staffCount.rows[0].count);

    // Try inserting a test staff member
    console.log('\n=== Testing Insert ===');
    try {
      const insertResult = await pool.query(
        'INSERT INTO teachers (staff_id, name, email, password, division) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        ['TEST001', 'Test Staff', 'test@example.com', 'test123', 'TestDiv']
      );
      console.log('✓ Test insert successful:', insertResult.rows[0]);

      // Delete the test record
      await pool.query('DELETE FROM teachers WHERE staff_id = $1', ['TEST001']);
      console.log('✓ Test record deleted');
    } catch (err: any) {
      console.error('✗ Test insert failed:', err.message);
    }

    console.log('\n✓ All database tests completed\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
