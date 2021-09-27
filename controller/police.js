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
  const batch_id = req.query.batchId;
  console.log(req.body);
  // console.log(nid);
  pool.getConnection((err, connection) => {
    if (!err) {
      console.log("conected");

      connection.query(
        "SELECT * FROM police_info where id=" + batch_id,
        (err, resultOfPolice) => {
          connection.release();
          if (!err) {
            console.log(resultOfPolice);
            // res.render("index", { items: rows });
            if (resultOfPolice.length != 0) {
              // res.json({

              //   status: 200,
              //   message: "Nid value match",
              //   data: rows
              // });
              var sql =
                'INSERT INTO police (police_batch_id, mobile, password, n_id ) VALUES ("' +
                batch_id +
                '", "' +
                req.query.mobile +
                '", "' +
                req.query.password +
                '", "' +
                resultOfPolice[0]["n_id"] +
                '")';
              console.log(sql);

              // res
              //   .status(201)
              //   .json({ message: "you successfully sign Up ", data: sql });

              connection.query(sql, (err, rows) => {
                //res.send(rows);
                if (!err) {
                  //res.redirect("/userProfile/" + nid);

                  res.status(201).json({
                    message: "you successfully sign Up ",
                    data: rows,
                    policeId: resultOfPolice[0]["id"],
                  });
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
        }
      );
    }
  });
};

exports.getPoliceInformation = (req, res) => {
  const batch_id = req.query.batchId;

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
                policeInformation: resulOfNid[0],
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
  const licenseNumber = req.query.license;

  //console.log("SELECT * FROM user WHERE mobile = '1837789993' AND password ='something' ");
  const sqlforUserLicense =
    'SELECT * FROM license where lc_no="' + licenseNumber + '"';
  console.log(sqlforUserLicense);

  pool.getConnection((err, connection) => {
    connection.query(sqlforUserLicense, (err, result) => {
      if (!err) {
        console.log(result);
        if (result.length != 0) {
          const sqlForUser = "SELECT * FROM user where id=" + result[0]["u_id"];

          connection.query(sqlForUser, (err, resulOfUser) => {
            if (!err) {
              res.status(200).json({
                msg: "License Found",
                licenseInformation: result,
                userInformation: resulOfUser,
              });
            } else {
              console.log("404" + sqlforUserLicense);

              res.status(200).json({
                msg: "License not found",
                licenseInformation: [],
                userInformation: [],
              });
            }
          });
        }
        //  res.redirect("/userProfile/" + result[0].n_id);
        else {
          res.status(200).json({
            msg: "License not found",
            licenseInformation: [],
            userInformation: [],
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

  pool.getConnection((err, connection) => {
    connection.query(sqlforUserLicense, (err, result) => {
      if (!err) {
        console.log(sqlforUserLicense);
        console.log(result);

        if (result.length != 0) {
          const sqlForUser = "SELECT * FROM user where id=" + result[0]["u_id"];

          connection.query(sqlForUser, (err, resulOfUser) => {
            if (!err) {
              const sqlForuserImage =
                "SELECT * FROM nid where n_id=" + result[0]["national_id"];

              connection.query(sqlForuserImage, (err, resulOfUserimage) => {
                res.status(200).json({
                  msg: "Vehicle is found",
                  vehicleInformation: result,
                  userInformation: resulOfUser,
                  userImage: resulOfUserimage
                });
              });
            } else {
              res.status(200).json({
                msg: "you have no right excess",
                vehicleInformation: [],
                userInformation: [],
                userImage: []
              });
            }
          });
        }
        //  res.redirect("/userProfile/" + result[0].n_id);
        else {
          console.log("404" + sqlforUserLicense);
          res.status(200).json({
            msg: "Vehicile not found",
            vehicleInformation: [],
            userInformation: [],
            userImage: []
          });
        }
      } else {
        console.log(err);
      }
    });
  });
};
