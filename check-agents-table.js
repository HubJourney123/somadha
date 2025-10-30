import dotenv from 'dotenv';
import { sql } from './src/lib/db.js';

dotenv.config({ path: '.env.local' });

async function checkAgentsTable() {
  try {
    console.log('Checking agents table structure...\n');

    // Check if table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'agents'
      );
    `;
    
    console.log('Table exists:', tableCheck[0].exists);

    if (!tableCheck[0].exists) {
      console.log('\n❌ Agents table does not exist!');
      console.log('Creating table now...\n');

      // Create agents table
      await sql`
        CREATE TABLE IF NOT EXISTS agents (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE,
          phone VARCHAR(20),
          upazila VARCHAR(50),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      console.log('✅ Agents table created successfully!');
    } else {
      // Show table structure
      const columns = await sql`
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'agents'
        ORDER BY ordinal_position;
      `;

      console.log('\nTable structure:');
      console.table(columns);

      // Show existing agents
      const agents = await sql`
        SELECT id, username, name, email, is_active, created_at
        FROM agents
        ORDER BY created_at DESC;
      `;

      console.log(`\nExisting agents: ${agents.length}`);
      if (agents.length > 0) {
        console.table(agents);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkAgentsTable();