#!/usr/bin/env node

/**
 * Database setup script for Uber Clone
 * Creates the necessary tables: drivers, rides, users
 */

const { neon } = require("@neondatabase/serverless");
require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🔌 Connecting to database...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const sql = neon(process.env.DATABASE_URL);
    console.log('✅ Connected to database successfully');

    // Create drivers table
    console.log('📋 Creating drivers table...');
    await sql`
      CREATE TABLE IF NOT EXISTS drivers (
        driver_id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        profile_image_url TEXT,
        car_image_url TEXT,
        car_seats INTEGER DEFAULT 4,
        rating DECIMAL(3,2) DEFAULT 5.0,
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Drivers table created');

    // Create rides table
    console.log('📋 Creating rides table...');
    await sql`
      CREATE TABLE IF NOT EXISTS rides (
        ride_id SERIAL PRIMARY KEY,
        origin_address TEXT NOT NULL,
        destination_address TEXT NOT NULL,
        origin_latitude DECIMAL(10,8) NOT NULL,
        origin_longitude DECIMAL(11,8) NOT NULL,
        destination_latitude DECIMAL(10,8) NOT NULL,
        destination_longitude DECIMAL(11,8) NOT NULL,
        ride_time DECIMAL(8,2) NOT NULL,
        fare_price INTEGER NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'pending',
        driver_id INTEGER REFERENCES drivers(driver_id),
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Rides table created');

    // Create users table (if not using Clerk's user management)
    console.log('📋 Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created');

    // Insert sample driver data
    console.log('📝 Inserting sample driver data...');
    await sql`
      INSERT INTO drivers (first_name, last_name, profile_image_url, car_image_url, car_seats, rating, latitude, longitude)
      VALUES 
        ('John', 'Smith', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop', 4, 4.8, 33.8547, 35.8623),
        ('Sarah', 'Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop', 5, 4.9, 33.8647, 35.8723),
        ('Mike', 'Davis', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300&h=200&fit=crop', 4, 4.7, 33.8447, 35.8523)
      ON CONFLICT (driver_id) DO NOTHING
    `;
    console.log('✅ Sample driver data inserted');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nTables created:');
    console.log('- drivers (with sample data)');
    console.log('- rides');
    console.log('- users');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();
