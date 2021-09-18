const express = require("express");
const app = express();

const pool = require("../database/database.js");

exports.getUserInformation = (req, res) => {
  console.log("ami");
  console.log(req.params.nid);
  pool.getConnection((err, connection) => {
    if (!err) {
      const sql =
        'SELECT user.u_name, user.mobile, user.id, nid.image, nid.p_address, nid.dob FROM user RIGHT JOIN nid ON nid.n_id = user.n_id WHERE user.n_id ="' +
        req.params.nid +
        '"';
      console.log(sql);
      connection.query(sql, (err, rows) => {
        connection.release();
        if (!err) {
          const sql2 =
            "SELECT * FROM user RIGHT JOIN license ON user.id = license.u_id WHERE user.id =" +
            rows[0].id;
          console.log(sql2);
          connection.query(sql2, (err, row6) => {
            // connection.release();

            if (!err) {
              // console.log(rows);
              // res.render("user", { user: rows, products: row6 });
              console.log(rows[0]);
              res.json({
                status: "user information get",
                userInfo: rows[0],
                license: row6,
              });
            } else {
              console.log("license");
              console.log(err);
            }

            //res.render("user", { user: rows });
            connection.destroy();
          });
        } else {
          console.log(err);
        }
      });
    } else {
      console.log("not connected");
      console.log(err);
    }
  });
};

exports.signInForUser = (req, res) => {
  const mobile = req.body.mobile;
  const password = req.body.password;
  console.log(req.body);
  //console.log("SELECT * FROM user WHERE mobile = '1837789993' AND password ='something' ");
  const sqlforSignIn =
    'SELECT * FROM user where mobile="' +
    mobile +
    '" AND password= "' +
    password +
    '"';
  // console.log(sqlforSignIn);
  pool.getConnection((err, connection) => {
    connection.query(sqlforSignIn, (err, result) => {
      if (!err) {
        console.log(result);

        if (result.length != 0) {
          res
            .status(200)
            .json({ message: "you successfully login", data: result[0].n_id });
          //  res.redirect("/userProfile/" + result[0].n_id);
        } else {
          res.status(200).send("yoy have no right excess");
        }
      } else {
        console.log(err);
      }
    });
  });
};

exports.signUpForUser = (req, res) => {
  const nid = req.body.nid_value;
  console.log(req.body);
  console.log(nid);
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
                //res.redirect("/userProfile/" + nid);

                res
                  .status(201)
                  .json({ message: "you successfully sign Up ", data: nid });
              } else {
                console.log(err);
              }
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
};
