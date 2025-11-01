import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: '.env.local' });

// Use production database URL from Vercel
const DATABASE_URL = process.env.DATABASE_URL;
console.log('Using database:', DATABASE_URL.substring(0, 50) + '...');

const sql = neon(DATABASE_URL);

async function testComplaint() {
  try {
    // Check total complaints
    const total = await sql`SELECT COUNT(*) as count FROM complaints`;
    console.log(`\nTotal complaints in database: ${total[0].count}`);

    if (total[0].count === 0) {
      console.log('\n❌ NO COMPLAINTS IN DATABASE!');
      console.log('The production database is empty.');
      return;
    }

    // Get all complaints
    const all = await sql`
      SELECT unique_id, category_name, status_name, created_at 
      FROM complaints 
      ORDER BY created_at DESC
    `;
    
    console.log('\n✅ All complaints in production database:');
    console.table(all);

    // Test specific complaint
    const uniqueId = 'SMD-MHC5NHX4-DLZV';
    console.log(`\nSearching for: ${uniqueId}`);
    
    const result = await sql`
      SELECT * FROM complaints WHERE unique_id = ${uniqueId}
    `;

    if (result.length === 0) {
      console.log('❌ This specific complaint NOT FOUND in production!');
    } else {
      console.log('✅ Complaint found!');
      console.table(result);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

testComplaint();