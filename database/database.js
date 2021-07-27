require('dotenv').config();
const mysql = require("mysql");

const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_Host,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
connection.getConnection((err, connection) => {
  if (!err) {
    console.log("conected");
  }
});
module.exports = connection