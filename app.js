const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mysql = require("mysql");
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
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
  res.render("home");
});

app.post("/home", (req, res) => {
  const nid = req.body.nid_value;
  console.log(req.body);
  // console.log(req.body.mobile);
  pool.getConnection((err, connection) => {
    if (!err) {
      console.log("conected");

      connection.query("SELECT * FROM nid where n_id=" + nid, (err, rows) => {
        connection.release();
        if (!err) {
          console.log(rows);
          // res.render("index", { items: rows });
          if (rows.length != 0) {
            // res.json({

            //   status: 200,
            //   message: "Nid value match",
            //   data: rows
            // });
            var sql =
              'INSERT INTO user (u_name, mobile, password, n_id ) VALUES ("' +
              rows[0].first_name +
              " " +
              rows[0].last_name +
              '", "' +
              req.body.mobile +
              '", "' +
              req.body.password +
              '", "' +
              nid +
              '")';
              console.log(sql);
            connection.query(sql, (err, rows) => {
              //res.send(rows);
              if (!err) {
                pool.getConnection((err, connection) => {
                  if (!err) {
                    const sql =
                      'SELECT user.u_name, user.mobile, user.id, nid.image, nid.p_address, nid.dob FROM user RIGHT JOIN nid ON nid.n_id = user.n_id WHERE user.n_id ="'+nid+'"';
                    console.log(sql);
                    connection.query(sql, (err, rows) => {
                      connection.release();
                      if (!err) {
                        console.log(rows[0].image);
                        // res.send(rows);
                        res.render("user", { user: rows });
                        connection.destroy();
                      } else {
                        console.log(err);
                      }
                    });
                  }
                });
              } else {
                console.log(err);
              }

              //  res.render("user", { user: rows });
              // pool.getConnection((err, connection) => {
              //   if (!err) {
              //     let sql= "SELECT user.u_name, user.mobile, user.id, nid.image, nid.p_address, nid.dob FROM user RIGHT JOIN nid ON nid.n_id = user.n_id WHERE user.n_id="+ nid;
              //     connection.query(sql, (err, rows) => {
              //       connection.release();
              //       if (!err) {
              //         console.log(rows);
              //        // res.send(rows);
              //        res.render("user", { user: rows });
              //       } else {
              //         console.log(err);
              //       }
              //     });

              //   }
              // });
            });
          } else {
            res.json({
              status: 404,
              message: "Nid value not match",
            });
          }
        } else {
          console.log(err);
        }
      });
    }
  });
});

app.get("/userProfile/:nid", (req, res) => {
  console.log('ami');
  console.log(req.params.nid);
  pool.getConnection((err, connection) => {
    if (!err) {
      const sql =
        'SELECT user.u_name, user.mobile, user.id, nid.image, nid.p_address, nid.dob FROM user RIGHT JOIN nid ON nid.n_id = user.n_id WHERE user.n_id ="'+req.params.nid+'"';
      console.log(sql);
      connection.query(sql, (err, rows) => {
        connection.release();
        if (!err) {
          console.log(rows[0].image);
          // res.send(rows);
          res.render("user", { user: rows });
          connection.destroy();
        } else {
          console.log(err);
        }
      });
    }
  });
});

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
