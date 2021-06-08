const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mysql = require("mysql");
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("images"));

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "dlvc",
});

pool.getConnection((err, connection) => {
  if (!err) {
    console.log("conected");
  }
});

app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      console.log("conected");

      connection.query("SELECT * FROM nid", (err, rows) => {
        connection.release();
        if (!err) {
          console.log(rows);
          res.render("index", { items: rows });
        } else {
          console.log(err);
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log("listening to the server on port " + port);
});
