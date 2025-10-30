import dotenv from 'dotenv';
import { initDatabase, sql } from './db.js';
import bcrypt from 'bcryptjs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Check if DATABASE_URL is loaded
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in .env.local');
    }
    
    console.log('Database URL loaded successfully');
    
    // Initialize tables
    await initDatabase();
    
    // Create default admin accounts
    const devPasswordHash = await bcrypt.hash(process.env.DEVELOPER_PASSWORD || 'admin123', 10);
    const politicianPasswordHash = await bcrypt.hash(process.env.POLITICIAN_PASSWORD || 'admin123', 10);
    
    await sql`
      INSERT INTO admins (role, email, password_hash)
      VALUES 
        ('developer', 'developer@somadha.com', ${devPasswordHash}),
        ('politician', 'politician@somadha.com', ${politicianPasswordHash})
      ON CONFLICT DO NOTHING
    `;
    
    // Add sample carousel images (optional)
await sql`
  INSERT INTO carousel_images (image_url, title, display_order, is_active)
  VALUES 
    ('/carousel/C1.svg', 'স্বাগতম সমাধায়', 1, true),
    ('/carousel/C2.svg', 'আপনার সমস্যা আমাদের দায়িত্ব', 2, true),
    ('/carousel/C3.svg', 'একসাথে গড়ি উন্নত ব্রাহ্মণবাড়িয়া', 3, true),
    ('/carousel/C4.svg', 'দ্রুত সমাধান, স্বচ্ছ প্রক্রিয়া', 4, true)
  ON CONFLICT DO NOTHING
`;

    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📋 Default credentials:');
    console.log('Developer: developer@somadha.com / admin123');
    console.log('Politician: politician@somadha.com / admin123');
    console.log('\n⚠️  Remember to change these passwords in production!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();