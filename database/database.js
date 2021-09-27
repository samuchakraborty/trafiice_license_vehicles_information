require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

 // port: 3306,
  //  ssl: true,
  // port: 2083,
  // connectTimeout: 60 * 60 * 1000,
  // acquireTimeout: 60 * 60 * 1000,
  // timeout: 60 * 60 * 1000,
  //insecureAuth: true,
  // debug: false,
});

// connection.release(error => error ? reject(error) : resolve());
connection.getConnection((err, connection) => {
  if (!err) {
    //connection.release();
    console.log("database conected");
  } else {
    console.log("not conected");
    console.log(err);
  }
});
module.exports = connection;
