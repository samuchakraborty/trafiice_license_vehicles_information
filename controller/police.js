const express = require("express");
const app = express();

const pool = require("../database/database.js");

exports.signInPolice = (req, res) => {
  const batch_id = req.body.batch_id;
  const mobile = req.body.mobile;
  const password = req.body.password;
  console.log(req.body);
  //console.log("SELECT * FROM user WHERE mobile = '1837789993' AND password ='something' ");
  const sqlforSignIn =
    'SELECT * FROM police where mobile="' +
    mobile +
    '" AND password= "' +
    password +
    '" AND police_batch_id="' +
    batch_id +
    '"';
  console.log(sqlforSignIn);
  pool.getConnection((err, connection) => {
    connection.query(sqlforSignIn, (err, result) => {
      if (!err) {
        console.log(result);

        if (result.length != 0) {
          res
            .status(200)
            .json({ message: "you successfully login", data: batch_id });
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

exports.signUpForPolice = (req, res) => {
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

exports.getPoliceInformation = (req, res) => {
  const batch_id = req.params.batch_id;

  //console.log("SELECT * FROM user WHERE mobile = '1837789993' AND password ='something' ");
  const sqlforSignIn = 'SELECT * FROM police_info where id="' + batch_id + '"';
  console.log(sqlforSignIn);

  pool.getConnection((err, connection) => {
    connection.query(sqlforSignIn, (err, result) => {
      if (!err) {
        console.log(result);
        const sqlForNid = "SELECT * FROM nid where n_id=" + result[0]["n_id"];
        if (result.length != 0) {
          connection.query(sqlForNid, (err, resulOfNid) => {
            if (!err) {
              res.status(200).json({
                message: "you successfully login",
                data: result[0],
                policeInforMation: resulOfNid[0],
              });
            } else {
              res.status(200).json({
                err: err,
                msg: "yoy have no right excess",
              });
            }
          });
        }
        //  res.redirect("/userProfile/" + result[0].n_id);
        else {
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

exports.getLicenseInformation = (req, res) => {
  const licenseNumber = req.params.licenseNumber;

  //console.log("SELECT * FROM user WHERE mobile = '1837789993' AND password ='something' ");
  const sqlforUserLicense =
    'SELECT * FROM license where lc_no="' + licenseNumber + '"';
  console.log(sqlforUserLicense);

  pool.getConnection((err, connection) => {
    connection.query(sqlforUserLicense, (err, result) => {
      if (!err) {
        console.log(result);
         const sqlForUser = "SELECT * FROM user where id=" + result[0]["u_id"];
        if (result.length != 0) {
         
          connection.query(sqlForUser, (err, resulOfUser) => {
            if (!err) {
                res.status(200).json({
                    msg: "you successfully get data",
                    licenseInformation: result[0],
                      userInformation: resulOfUser[0],
                  });
            } else {
              res.status(200).json({
                err: err,
                msg: "yoy have no right excess",
              });
            }
          });
        }
        //  res.redirect("/userProfile/" + result[0].n_id);
        else {
          res.status(401).json({
            code: res.statusCode,
            Status: "This user have no license",
            msg: "there is no License information",
          });
        }
      } else {
        console.log(err);
      }
    });
  });
};




exports.getVehicleInformation = (req, res) => {
  const vehicleNumber = req.query.vc;

  //console.log("SELECT * FROM user WHERE mobile = '1837789993' AND password ='something' ");
  const sqlforUserLicense =
    'SELECT * FROM vehicles where vehicles_no="' + vehicleNumber + '"';
  console.log(sqlforUserLicense);

  pool.getConnection((err, connection) => {
    connection.query(sqlforUserLicense, (err, result) => {
      if (!err) {
        console.log(result);
         const sqlForUser = "SELECT * FROM user where id=" + result[0]["u_id"];
        if (result.length != 0) {
         
          connection.query(sqlForUser, (err, resulOfUser) => {
            if (!err) {
                res.status(200).json({
                    msg: "you successfully get data",
                    vehicleInformation: result[0],
                      userInformation: resulOfUser[0],
                  });
            } else {
              res.status(200).json({
                err: err,
                msg: "yoy have no right excess",
              });
            }
          });
        }
        //  res.redirect("/userProfile/" + result[0].n_id);
        else {
          res.status(401).json({
            code: res.statusCode,
            Status: "This user have no license",
            msg: "there is no License information",
          });
        }
      } else {
        console.log(err);
      }
    });
  });
};
