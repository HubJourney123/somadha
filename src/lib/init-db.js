import { initDatabase, sql } from './db.js';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
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
        ('https://via.placeholder.com/800x400', 'স্বাগতম সমাধায়', 1, true),
        ('https://via.placeholder.com/800x400', 'আপনার সমস্যা আমাদের দায়িত্ব', 2, true),
        ('https://via.placeholder.com/800x400', 'একসাথে গড়ি উন্নত ব্রাহ্মণবাড়িয়া', 3, true)
      ON CONFLICT DO NOTHING
    `;
    
    console.log('Database setup completed successfully!');
    console.log('Default credentials:');
    console.log('Developer: developer@somadha.com / admin123');
    console.log('Politician: politician@somadha.com / admin123');
    
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();