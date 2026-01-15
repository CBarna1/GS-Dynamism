// backend/config/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');  // <-- Destructure Sequelize here
const mysql = require('mysql2/promise');

const {
  DB_HOST = '127.0.0.1',
  DB_USER = 'root',
  DB_PASS = '',  // blank for XAMPP default
  DB_NAME = 'guiding_stars_db',
  DB_PORT = 3306,
} = process.env;

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      port: DB_PORT,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database '${DB_NAME}' ready (created or already exists)`);

    await connection.end();
  } catch (err) {
    console.error('Failed to create/init database:', err.message);
    process.exit(1);
  }
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,  // set to console.log for more debug info
});

module.exports = {
  sequelize,
  initializeDatabase,
};