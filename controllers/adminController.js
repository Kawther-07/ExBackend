// const { Pool } = require('pg');
// const bcrypt = require("bcrypt");

// // Create a pool for PostgreSQL connections
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'DFU_DB4',
//   password: 'kawther1234',
//   port: 5432,
// });

// // Function to create a new admin
// exports.createAdmin = async (req, res) => {
//     try {
//         const { id, first_name, last_name, email, phone, password, role } = req.body;
//         // Check if admin with the same email already exists
//         // const duplicateQuery = 'SELECT * FROM admin WHERE email = $1';
//         // const duplicateValues = [email];
//         let duplicateResult = null; 
//         let insertResult = null;
//         let insertValues = null;
//         try {
//             duplicateResult = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
//             // Process the result
//         } catch (error) {
//             // Handle the error
//             console.error('Error executing query:', error);
//         }
//         if (duplicateResult.rows.length > 0) {
//             return res.status(400).json({ status: false, message: `L'email ${email} est déjà enregistré` });
//         }
//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(password, salt);
//         // Insert the new admin into the database
//         const insertQuery = 'INSERT INTO admins (id, first_name, last_name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
//         insertValues = [id, first_name, last_name, email, phone, password, role];
//         insertResult = await pool.query(insertQuery, insertValues);
//         // const admin = insertResult.rows[0];
//         res.json({ status: true, message: 'Admin enregistré avec succès', id: insertValues.id });
//     } catch (error) {
//         console.error('Error creating admin:', error);
//         res.status(500).json({ status: false, message: 'Erreur interne du serveur' });
//     }
// }

// // Function to login admin
// exports.loginAdmin = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         // Retrieve admin by email
//         const query = 'SELECT * FROM admin WHERE email = $1';
//         const values = [email];
//         const result = await pool.query(query, values);
//         const admin = result.rows[0];

//         if (!admin) {
//             return res.status(404).json({ status: false, message: 'L\'administrateur n\'existe pas' });
//         }

//         // Compare passwords
//         const isPasswordCorrect = await bcrypt.compare(password, admin.password);

//         if (!isPasswordCorrect) {
//             return res.status(401).json({ status: false, message: 'Le nom d\'administrateur ou le mot de passe ne correspond pas' });
//         }

//         res.status(200).json({ status: true, message: 'Bien connecté', id: admin.id });
//     } catch (error) {
//         console.error('Error logging in admin:', error);
//         res.status(500).json({ status: false, message: 'Erreur interne du serveur' });
//     }
// }


const Admin = require('../models/admin');
const bcrypt = require('bcrypt');


exports.createAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, role } = req.body;
        
        // Check if admin with the same email already exists
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ status: false, message: `L'email ${email} est déjà enregistré` });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin with hashed password
        const admin = await Admin.create({ first_name, last_name, email, phone, password: hashedPassword, role });
        res.json({ status: true, message: 'Admin enregistré avec succès', id: admin.id });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ status: false, message: 'Erreur interne du serveur' });
    }
};

// exports.loginAdmin = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         // Retrieve admin by email
//         const admin = await Admin.findOne({ where: { email } });
//         if (!admin) {
//             return res.status(404).json({ status: false, message: 'L\'administrateur n\'existe pas' });
//         }

//         // Compare passwords
//         const isPasswordCorrect = await admin.compareMot_de_passe(password);
//         if (!isPasswordCorrect) {
//             return res.status(401).json({ status: false, message: 'Le nom d\'administrateur ou le mot de passe ne correspond pas' });
//         }

//         res.status(200).json({ status: true, message: 'Bien connecté', id: admin.id });
//     } catch (error) {
//         console.error('Error logging in admin:', error);
//         res.status(500).json({ status: false, message: 'Erreur interne du serveur' });
//     }
// };



exports.loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Retrieve admin by email
        const admin = await Admin.findOne({ where: { email } });
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
};
