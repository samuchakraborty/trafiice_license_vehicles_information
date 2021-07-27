const express = require("express");
const bodyParser = require("body-parser");
const user = require("./controller/user");
const ejs = require("ejs");
const app = express();
// const mysql = require("mysql");
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("images"));

const pool = require('./database/database.js');


app.get("", (req, res) => {
  res.render("home");
});

app.post("/home", user.signUpForUser);
app.post("/signInpage", user.signInForUser);


app.get("/signIn", (req, res) => {
  res.render("signin");
});

app.get("/userProfile/:nid", user.getUserInformation);




app.get("/home", (req, res) => {
  pool.getConnection((err, connection) => {
    if (!err) {
      console.log("conected");

      connection.query("SELECT * FROM nid", (err, rows) => {
        connection.release();
        if (!err) {
          console.log(rows);
          res.render("index", { items: rows });
          connection.destroy();
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
