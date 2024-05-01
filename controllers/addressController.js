import asyncHandler from "../middlewares/asyncHandler.js";
import pool from '../config/db.js'

import { v4 as uuidv4 } from 'uuid';

const createAddress = asyncHandler(async (req, res) => {
    try {
        const { user, address } = req.body;
        const { address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode } = address;

        // Generate a UUID for user ID
        const userId = uuidv4();

        const addressResult = await pool.query(
            'INSERT INTO addresses (address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
            [address_type_code, is_primary, name, primary_contact_name, line1, line2, line3, city, state_or_province, country, zipcode]
        );
        const addressId = addressResult.rows[0].id;

        await pool.query(
            'INSERT INTO user_address (user_id, address_id, relationship_type) VALUES ($1, $2, $3)',
            [userId, addressId, user.relationship_type]
        );

        res.status(201).json({ message: 'Address added successfully' });
    } catch (error) {
        console.error('Error adding address:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const getAddress = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
        
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
})

const updateAddress = asyncHandler(async (req, res) => {
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
})

const deleteAddress = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
        // Delete address from the addresses table
        await pool.query('DELETE FROM addresses WHERE id = $1', [id]);

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
export {
    createAddress,
    getAddress,
    updateAddress,
    deleteAddress
}