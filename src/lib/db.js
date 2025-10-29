// Database configuration and utilities
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

export const sql = neon(process.env.DATABASE_URL);

// Initialize database tables
export async function initDatabase() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        image TEXT,
        google_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Complaints table
    await sql`
      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        unique_id VARCHAR(20) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        category_id INTEGER NOT NULL,
        category_name VARCHAR(255) NOT NULL,
        upazila VARCHAR(255) NOT NULL,
        union_name VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        image_url TEXT,
        is_anonymous BOOLEAN DEFAULT FALSE,
        status_id INTEGER DEFAULT 1,
        status_name VARCHAR(255) DEFAULT 'সমস্যা/অভিযোগ জমা হয়েছে',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Complaint status history table
    await sql`
      CREATE TABLE IF NOT EXISTS complaint_status_history (
        id SERIAL PRIMARY KEY,
        complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
        status_id INTEGER NOT NULL,
        status_name VARCHAR(255) NOT NULL,
        updated_by_type VARCHAR(50),
        updated_by_id INTEGER,
        updated_by_name VARCHAR(255),
        solution_image_url TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Admins table (for politician and developer)
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        role VARCHAR(50) NOT NULL CHECK (role IN ('developer', 'politician')),
        email VARCHAR(255),
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Agents table
    await sql`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        created_by_admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
        created_by_role VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Activities table (for home page activities)
    await sql`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        summary TEXT NOT NULL,
        image_url TEXT,
        created_by_agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
        created_by_name VARCHAR(255),
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Carousel images table
    await sql`
      CREATE TABLE IF NOT EXISTS carousel_images (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        title VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_unique_id ON complaints(unique_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_status_history_complaint ON complaint_status_history(complaint_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_agents_username ON agents(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_activities_published ON activities(is_published, created_at DESC)`;

    console.log('Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to generate unique complaint ID
export function generateComplaintId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SMD-${timestamp}-${random}`;
}

// User operations
export async function createUser(userData) {
  const { email, name, image, googleId } = userData;
  
  try {
    const result = await sql`
      INSERT INTO users (email, name, image, google_id)
      VALUES (${email}, ${name}, ${image}, ${googleId})
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        image = EXCLUDED.image,
        google_id = EXCLUDED.google_id
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return result[0];
  } catch (error) {
    console.error('Error getting user by id:', error);
    throw error;
  }
}

// Complaint operations
export async function createComplaint(complaintData) {
  const {
    userId,
    categoryId,
    categoryName,
    upazila,
    unionName,
    details,
    imageUrl,
    isAnonymous
  } = complaintData;

  const uniqueId = generateComplaintId();

  try {
    const result = await sql`
      INSERT INTO complaints (
        unique_id, user_id, category_id, category_name, 
        upazila, union_name, details, image_url, is_anonymous
      )
      VALUES (
        ${uniqueId}, ${userId}, ${categoryId}, ${categoryName},
        ${upazila}, ${unionName}, ${details}, ${imageUrl}, ${isAnonymous}
      )
      RETURNING *
    `;

    // Create initial status history entry
    await sql`
      INSERT INTO complaint_status_history (
        complaint_id, status_id, status_name
      )
      VALUES (
        ${result[0].id}, 1, 'সমস্যা/অভিযোগ জমা হয়েছে'
      )
    `;

    return result[0];
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
}

export async function getComplaintByUniqueId(uniqueId) {
  try {
    const result = await sql`
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.unique_id = ${uniqueId}
    `;
    return result[0];
  } catch (error) {
    console.error('Error getting complaint:', error);
    throw error;
  }
}

export async function getComplaintsByUserId(userId, limit = 50, offset = 0) {
  try {
    const result = await sql`
      SELECT * FROM complaints 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return result;
  } catch (error) {
    console.error('Error getting user complaints:', error);
    throw error;
  }
}

export async function getAllComplaints(filters = {}, limit = 100, offset = 0) {
  const { categoryId, statusId, upazila, searchQuery } = filters;

  try {
    let query = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (categoryId) {
      query += ` AND c.category_id = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    if (statusId) {
      query += ` AND c.status_id = $${paramIndex}`;
      params.push(statusId);
      paramIndex++;
    }

    if (upazila) {
      query += ` AND c.upazila = $${paramIndex}`;
      params.push(upazila);
      paramIndex++;
    }

    if (searchQuery) {
      query += ` AND (c.unique_id ILIKE $${paramIndex} OR c.details ILIKE $${paramIndex})`;
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await sql(query, params);
    return result;
  } catch (error) {
    console.error('Error getting all complaints:', error);
    throw error;
  }
}

export async function updateComplaintStatus(complaintId, statusData) {
  const { statusId, statusName, updatedByType, updatedById, updatedByName, solutionImageUrl, notes } = statusData;

  try {
    // Update complaint status
    await sql`
      UPDATE complaints 
      SET 
        status_id = ${statusId},
        status_name = ${statusName},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${complaintId}
    `;

    // Add to status history
    await sql`
      INSERT INTO complaint_status_history (
        complaint_id, status_id, status_name, 
        updated_by_type, updated_by_id, updated_by_name,
        solution_image_url, notes
      )
      VALUES (
        ${complaintId}, ${statusId}, ${statusName},
        ${updatedByType}, ${updatedById}, ${updatedByName},
        ${solutionImageUrl}, ${notes}
      )
    `;

    return { success: true };
  } catch (error) {
    console.error('Error updating complaint status:', error);
    throw error;
  }
}

export async function getComplaintStatusHistory(complaintId) {
  try {
    const result = await sql`
      SELECT * FROM complaint_status_history
      WHERE complaint_id = ${complaintId}
      ORDER BY created_at ASC
    `;
    return result;
  } catch (error) {
    console.error('Error getting status history:', error);
    throw error;
  }
}

// Agent operations
export async function createAgent(agentData) {
  const { username, passwordHash, fullName, phone, email, createdByAdminId, createdByRole } = agentData;

  try {
    const result = await sql`
      INSERT INTO agents (
        username, password_hash, full_name, phone, email,
        created_by_admin_id, created_by_role
      )
      VALUES (
        ${username}, ${passwordHash}, ${fullName}, ${phone}, ${email},
        ${createdByAdminId}, ${createdByRole}
      )
      RETURNING id, username, full_name, phone, email, is_active, created_at
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
}

export async function getAgentByUsername(username) {
  try {
    const result = await sql`
      SELECT * FROM agents WHERE username = ${username}
    `;
    return result[0];
  } catch (error) {
    console.error('Error getting agent:', error);
    throw error;
  }
}

export async function getAllAgents() {
  try {
    const result = await sql`
      SELECT 
        id, username, full_name, phone, email, 
        is_active, created_by_role, created_at
      FROM agents
      ORDER BY created_at DESC
    `;
    return result;
  } catch (error) {
    console.error('Error getting agents:', error);
    throw error;
  }
}

export async function updateAgent(agentId, updateData) {
  const { fullName, phone, email, isActive, passwordHash } = updateData;

  try {
    let query = `UPDATE agents SET updated_at = CURRENT_TIMESTAMP`;
    const params = [];
    let paramIndex = 1;

    if (fullName !== undefined) {
      query += `, full_name = $${paramIndex}`;
      params.push(fullName);
      paramIndex++;
    }

    if (phone !== undefined) {
      query += `, phone = $${paramIndex}`;
      params.push(phone);
      paramIndex++;
    }

    if (email !== undefined) {
      query += `, email = $${paramIndex}`;
      params.push(email);
      paramIndex++;
    }

    if (isActive !== undefined) {
      query += `, is_active = $${paramIndex}`;
      params.push(isActive);
      paramIndex++;
    }

    if (passwordHash) {
      query += `, password_hash = $${paramIndex}`;
      params.push(passwordHash);
      paramIndex++;
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, username, full_name, phone, email, is_active`;
    params.push(agentId);

    const result = await sql(query, params);
    return result[0];
  } catch (error) {
    console.error('Error updating agent:', error);
    throw error;
  }
}

export async function deleteAgent(agentId) {
  try {
    await sql`
      DELETE FROM agents WHERE id = ${agentId}
    `;
    return { success: true };
  } catch (error) {
    console.error('Error deleting agent:', error);
    throw error;
  }
}

// Activity operations
export async function createActivity(activityData) {
  const { title, summary, imageUrl, createdByAgentId, createdByName } = activityData;

  try {
    const result = await sql`
      INSERT INTO activities (
        title, summary, image_url, created_by_agent_id, created_by_name
      )
      VALUES (
        ${title}, ${summary}, ${imageUrl}, ${createdByAgentId}, ${createdByName}
      )
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}

export async function getPublishedActivities(limit = 10) {
  try {
    const result = await sql`
      SELECT * FROM activities
      WHERE is_published = true
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result;
  } catch (error) {
    console.error('Error getting activities:', error);
    throw error;
  }
}

export async function getAllActivities() {
  try {
    const result = await sql`
      SELECT * FROM activities
      ORDER BY created_at DESC
    `;
    return result;
  } catch (error) {
    console.error('Error getting all activities:', error);
    throw error;
  }
}

export async function updateActivity(activityId, updateData) {
  const { title, summary, imageUrl, isPublished } = updateData;

  try {
    const result = await sql`
      UPDATE activities
      SET
        title = COALESCE(${title}, title),
        summary = COALESCE(${summary}, summary),
        image_url = COALESCE(${imageUrl}, image_url),
        is_published = COALESCE(${isPublished}, is_published),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${activityId}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
}

export async function deleteActivity(activityId) {
  try {
    await sql`
      DELETE FROM activities WHERE id = ${activityId}
    `;
    return { success: true };
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
}

// Statistics operations
export async function getComplaintStats() {
  try {
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM complaints
    `;

    const solvedResult = await sql`
      SELECT COUNT(*) as solved FROM complaints WHERE status_id = 5
    `;

    const byCategory = await sql`
      SELECT 
        category_name,
        COUNT(*) as count
      FROM complaints
      GROUP BY category_name
      ORDER BY count DESC
    `;

    const byStatus = await sql`
      SELECT 
        status_name,
        COUNT(*) as count
      FROM complaints
      GROUP BY status_id, status_name
      ORDER BY status_id
    `;

    const byUpazila = await sql`
      SELECT 
        upazila,
        COUNT(*) as count
      FROM complaints
      GROUP BY upazila
      ORDER BY count DESC
    `;

    const recentComplaints = await sql`
      SELECT 
        COUNT(*) as count,
        DATE_TRUNC('day', created_at) as date
      FROM complaints
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date DESC
    `;

    return {
      total: parseInt(totalResult[0].total),
      solved: parseInt(solvedResult[0].solved),
      byCategory,
      byStatus,
      byUpazila,
      recentComplaints
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
}

// Carousel operations
export async function getActiveCarouselImages() {
  try {
    const result = await sql`
      SELECT * FROM carousel_images
      WHERE is_active = true
      ORDER BY display_order, created_at DESC
    `;
    return result;
  } catch (error) {
    console.error('Error getting carousel images:', error);
    throw error;
  }
}

export async function addCarouselImage(imageData) {
  const { imageUrl, title, displayOrder } = imageData;

  try {
    const result = await sql`
      INSERT INTO carousel_images (image_url, title, display_order)
      VALUES (${imageUrl}, ${title}, ${displayOrder || 0})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error adding carousel image:', error);
    throw error;
  }
}