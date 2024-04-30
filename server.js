const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config(); 
const app = express();
const port = 3000;


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432, 
    ssl: {
        rejectUnauthorized: false
    }
  });


app.use(bodyParser.json());


app.post('/addresses', async (req, res) => {
    try {
        const { user_id, address } = req.body;
        const { address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode } = address;

        const addressResult = await pool.query(
            'INSERT INTO addresses (address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
            [address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode]
        );
        const addressId = addressResult.rows[0].id;

        
        await pool.query(
            'INSERT INTO user_address (user_id, address_id, relationship_type) VALUES ($1, $2, $3)',
            [user_id, addressId, 'OWNER'] // Assuming 'OWNER' relationship for simplicity
        );

        res.status(201).json({ message: 'Address added successfully' });
    } catch (error) {
        console.error('Error adding address:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/addresses/:id', async (req, res) => {
    const id = req.params.id;
    const { address } = req.body;

    try {
        // Update address in the addresses table
        await pool.query(
            'UPDATE addresses SET address_type_code = $1, is_primary = $2, name = $3, primary_contact_name = $4, line1 = $5, line2 = $6, line3 = $7, city = $8, state_or_province = $9, country = $10, zipcode = $11 WHERE id = $12',
            [address.address_type_code, address.is_primary, address.name, address.primary_contact_name, address.line1, address.line2, address.line3, address.city, address.state_or_province, address.country, address.zipcode, id]
        );

        res.status(200).json({ message: 'Address updated successfully' });
    } catch (error) {
        console.error('Error updating address:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/addresses/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Delete address from the addresses table
        await pool.query('DELETE FROM addresses WHERE id = $1', [id]);

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/addresses/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Retrieve address from the addresses table
        const result = await pool.query('SELECT * FROM addresses WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Address not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error retrieving address:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
