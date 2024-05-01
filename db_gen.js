const { Pool } = require('pg');
require('dotenv').config(); 


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432, // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false, 
    }
  });


const createTablesQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        address_type_code VARCHAR(20) CHECK (address_type_code IN ('HOME', 'WORK')),
        is_primary BOOLEAN,
        name VARCHAR(100) NOT NULL,
        primary_contact_name VARCHAR(100) NOT NULL,
        line1 VARCHAR(255) NOT NULL,
        line2 VARCHAR(255),
        line3 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state_or_province VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        zipcode VARCHAR(20) NOT NULL
    );
    

    CREATE TABLE IF NOT EXISTS user_address (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        address_id UUID REFERENCES addresses(id),
        relationship_type VARCHAR(20) CHECK (relationship_type IN ('OWNER', 'TENANT', 'OTHER')) NOT NULL
    );
`;


async function createTables() {
    try {
        await pool.query(createTablesQuery);
        console.log('Tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err.message);
    } finally {
      
        await pool.end();
    }
}


createTables();
