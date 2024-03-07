const { Pool } = require('pg');
const bcrypt = require("bcrypt");

import { AdminServices } from '../services/admin.service.js';

// Create a pool for PostgreSQL connections
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DFU_DB',
  password: 'kawther1234',
  port: 5432,
});

// Function to create a new admin
// exports.createAdmin = async (req, res, next) => {
//     try {
//         const { email, password, first_name, last_name, phone, role } = req.body;

//         // Check if admin with the same email already exists
//         const duplicateQuery = 'SELECT * FROM admin WHERE email = $1';
//         const duplicateValues = [email];
//         const duplicateResult = await pool.query(duplicateQuery, duplicateValues);

//         if (duplicateResult.rows.length > 0) {
//             return res.status(400).json({ status: false, message: `L'email ${email} est déjà enregistré` });
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password, salt);

//         // Insert the new admin into the database
//         const insertQuery = 'INSERT INTO admin (first_name, last_name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
//         const insertValues = [email, password, first_name, last_name, phone, role];
//         const insertResult = await pool.query(insertQuery, insertValues);
//         const admin = insertResult.rows[0];

//         res.json({ status: true, message: 'Admin enregistré avec succès', id: admin.id });
//     } catch (error) {
//         console.error('Error creating admin:', error);
//         res.status(500).json({ status: false, message: 'Erreur interne du serveur' });
//     }
// }


export const createAdmin = async (req, res, next) => {
    // Te3 Rania
    try {
      const { Email, Password, First_name, Last_name, Phone, Role } = req.body;
      const duplicate = await AdminServices.getAdminByEmail(Email);
  
      if (duplicate) {
        return res.status(400).json({ status: false, message: `Email ${Email} is already saved` });
      }
  
      const admin = await AdminServices.registerAdmin(Email, Password, First_name, Last_name, Phone, Role);
  
      const tokenData = { _id: admin._id, Email: Email, Role: 'admin' };
      const token = await AdminServices.generateAccessToken(tokenData, '365d');
  
      res.json({ status: true, message: 'Admin is created', token, id: admin._id, data: admin });
    } catch (err) {
      console.log('---> err -->', err);
      next(err);
    }
  };




// Function to login admin
exports.loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Retrieve admin by email
        const query = 'SELECT * FROM admin WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);
        const admin = result.rows[0];

        if (!admin) {
            return res.status(404).json({ status: false, message: 'L\'administrateur n\'existe pas' });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ status: false, message: 'Le nom d\'administrateur ou le mot de passe ne correspond pas' });
        }

        res.status(200).json({ status: true, message: 'Bien connecté', id: admin.id });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ status: false, message: 'Erreur interne du serveur' });
    }
}
