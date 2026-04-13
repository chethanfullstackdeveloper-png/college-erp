import { pool } from './src/db';

async function clearTestData() {
  try {
    console.log('\n=== Clearing Test Data ===');

    // Delete all teachers (staff)
    const staffResult = await pool.query('DELETE FROM teachers');
    console.log(`✓ Deleted ${staffResult.rowCount} staff records`);

    // Delete all students
    const studentResult = await pool.query('DELETE FROM students');
    console.log(`✓ Deleted ${studentResult.rowCount} student records`);

    // Verify
    const staffCount = await pool.query('SELECT COUNT(*) as count FROM teachers');
    const studentCount = await pool.query('SELECT COUNT(*) as count FROM students');
    
    console.log(`✓ Teachers table now has: ${staffCount.rows[0].count} records`);
    console.log(`✓ Students table now has: ${studentCount.rows[0].count} records`);
    console.log('\n✅ All test data cleared successfully\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

clearTestData();
