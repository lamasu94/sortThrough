const dotenv = require ("dotenv");
const mysql = require ("mysql2/promise");

dotenv.config();

//creating connection
const db = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
})

//verify connection work 
db.getConnection()
    .then((connection) => {
        console.log("DATABASE CONNECTED");
        connection.release(); 
    })
    .catch((err) => {
        console.error("DATABASE CONNECTION FAILED:", err.message);
    });

module.exports = db;