const { Pool } = require('pg');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Create a pool for PostgreSQL connections
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DFU_DB',
  password: 'kawther1234',
  port: 5432,
});

class AdminServices {

    static async registerAdmin(email, password, first_name, last_name, phone, role) {
        try {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            // Insert the new admin into the database
            const insertQuery = 'INSERT INTO admin (email, password, first_name, last_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
            const insertValues = [email, password, first_name, last_name, phone, role];
            const result = await pool.query(insertQuery, insertValues);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAdminByEmail(email) {
        try {
            const query = 'SELECT * FROM admin WHERE email = $1';
            const values = [email];
            const result = await pool.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async checkAdmin(email) {
        try {
            const query = 'SELECT * FROM admin WHERE email = $1';
            const values = [email];
            const result = await pool.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }
}

module.exports = AdminServices;
