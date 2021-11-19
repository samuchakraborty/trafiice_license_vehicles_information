const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
app.use(fileUpload());
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
          console.log(rows);
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
  console.log(sqlforSignIn);
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
          res.status(200).json({
            err: err,
            msg: "yoy have no right excess",
          });
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
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
exports.applyForLicense = (req, res) => {
  let samplefile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("no file were uploaded");
  }
  samplefile = req.files.profileFile;
  uploadPath = process.env.PWD + "/upload/" + samplefile.name;
  //console.log(req.query);
  var sql =
    'INSERT INTO license (lc_type, u_id, image, lc_no, lc_status, user_type ,name, application_date) VALUES ("' +
    req.body.lc_type +
    '", "' +
    req.body.uid +
    '", "' +
    samplefile.name +
    '", "' +
    getRandomInt(100000000000000) +
    '", "' +
    req.body.lc_status +
    '", "' +
    req.body.user_type +
    '", "' +
    req.body.name +
    '", "' +
    req.body.application_date +
    '")';

  console.log(uploadPath);
  samplefile.mv(uploadPath, function (err) {
    if (err) {
      res.status(200).send(err);
    } else {
      pool.getConnection((err, connection) => {
        if (!err) {
          console.log("data base conected");
          connection.query(sql, (err, rows) => {
            connection.release();
            if (!err) {
              console.log(sql);
              res.json({
                msg: "All data insert successfully done",
                data: rows,
              });
            } else {
              res.json({
                msg: err,
                sql: sql,
              });
            }
          });
        } else {
          res.json({
            code: 300,
            msg: "not yet sloved",
          });
        }
      });
    }
  });
};

exports.addYourVechileNumber = (req, res) => {
  let samplefile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("no file were uploaded");
  }
  samplefile = req.files.profileFile;
  uploadPath = process.env.PWD + "/upload/" + samplefile.name;
  console.log(samplefile);
  var sql =
    'INSERT INTO vehicles (national_id, u_id, image, vehicles_no, insurance_date, fitness_report_number ,insurnce_number,type) VALUES ("' +
    req.body.n_id +
    '", "' +
    req.body.uid +
    '", "' +
    samplefile.name +
    '", "' +
    req.body.vehicles_no +
    '", "' +
    req.body.insurance_date +
    '", "' +
    req.body.fitness_number +
    '", "' +
    req.body.insurance_number +
    '", "' +
    req.body.typeOfV +
    '")';

  console.log(sql);
  samplefile.mv(uploadPath, function (err) {
    if (err) {
      res.status(200).send(err);
    } else {
      pool.getConnection((err, connection) => {
        if (!err) {
          console.log("data base conected");
          connection.query(sql, (err, rows) => {
            connection.release();
            if (!err) {
              console.log(sql);
              res.json({
                msg: "All data insert successfully done",
                data: rows,
              });
            } else {
              res.json({
                msg: err,
                sql: sql,
              });
            }
          });
        } else {
          res.json({
            code: 300,
            msg: "not yet sloved",
          });
        }
      });
    }
  });
};

exports.getVechileInformation = (req, res) => {
  var sql = "SELECT * FROM vehicles where national_id =" + req.params.nid;

  console.log(sql);

  pool.getConnection((err, connection) => {
    if (!err) {
      console.log("data base conected");
      connection.query(sql, (err, rows) => {
        connection.release();
        if (!err) {
          console.log(sql);
          res.json({
            msg: "Vehicle Information done",
            code: res.statusCode,
            data: rows,
          });
        } else {
          res.json({
            msg: err,
            code: res.statusCode,
            sql: sql,
          });
        }
      });
    } else {
      res.json({
        code: 300,
        msg: "not yet sloved",
      });
    }
  });
};

exports.paymentStatus = (req, res) => {
  const id = req.query.userId;
  console.log(id);
  var sql =
    "SELECT * FROM user RIGHT JOIN taxes ON user.id = taxes.u_id WHERE user.id =" +
    id;

  console.log(sql);

  pool.getConnection((err, connection) => {
    if (!err) {
      console.log("data base conected");
      connection.query(sql, (err, rows) => {
        connection.release();
        if (!err) {
          console.log(sql);
          res.json({
            msg: "Vehicle Information done",
            code: res.statusCode,
            data: rows,
          });
        } else {
          res.json({
            msg: err,
            code: res.statusCode,
            sql: sql,
          });
        }
      });
    } else {
      res.json({
        code: 300,
        msg: "not yet sloved",
      });
    }
  });
};
