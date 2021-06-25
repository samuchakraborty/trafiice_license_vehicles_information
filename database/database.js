const mysql = require("mysql");

const connection = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "dlvc",
});
connection.getConnection((err, connection) => {
  if (!err) {
    console.log("conected");
  }
});
module.exports = connection