const express = require("express");
const app = express();

const pool = require("../database/database.js");




exports.getLicenseInformation = (req, res) => {
    const licenseNumber = req.query.license;
  
    //console.log("SELECT * FROM user WHERE mobile = '1837789993' AND password ='something' ");
    const sqlforUserLicense =
      'SELECT * FROM license';
    console.log(sqlforUserLicense);
  
    pool.getConnection((err, connection) => {
      connection.query(sqlforUserLicense, (err, result) => {
        if (!err) {
            res.status(200).json({
                msg: "User Found",
                license: result
              });


        //   console.log(result);
        //   if (result.length != 0) {
        //     const sqlForUser = "SELECT * FROM user where id=" + result[0]["u_id"];
  
        //     connection.query(sqlForUser, (err, resulOfUser) => {
        //       if (!err) {
        //         res.status(200).json({
        //           msg: "License Found",
        //           licenseInformation: result,
        //           userInformation: resulOfUser,
        //         });
        //       } else {
        //         console.log("404" + sqlforUserLicense);
  
        //         res.status(200).json({
        //           msg: "License not found",
        //           licenseInformation: [],
        //           userInformation: [],
        //         });
        //       }
        //     });
        //   }
        //   //  res.redirect("/userProfile/" + result[0].n_id);
        //   else {
        //     res.status(200).json({
        //       msg: "License not found",
        //       licenseInformation: [],
        //       userInformation: [],
        //     });
        //   }
        } else {
          console.log(err);
        }
      });
    });
  };



  exports.getVehicleInformation = (req, res) => {
    const licenseNumber = req.query.license;
  
    //console.log("SELECT * FROM user WHERE mobile = '1837789993' AND password ='something' ");
    const sqlforUserLicense =
      'SELECT * FROM vehicles';
    console.log(sqlforUserLicense);
  
    pool.getConnection((err, connection) => {
      connection.query(sqlforUserLicense, (err, result) => {
        if (!err) {
            res.status(200).json({
                msg: "User Found",
                vehicles: result
              });


        //   console.log(result);
        //   if (result.length != 0) {
        //     const sqlForUser = "SELECT * FROM user where id=" + result[0]["u_id"];
  
        //     connection.query(sqlForUser, (err, resulOfUser) => {
        //       if (!err) {
        //         res.status(200).json({
        //           msg: "License Found",
        //           licenseInformation: result,
        //           userInformation: resulOfUser,
        //         });
        //       } else {
        //         console.log("404" + sqlforUserLicense);
  
        //         res.status(200).json({
        //           msg: "License not found",
        //           licenseInformation: [],
        //           userInformation: [],
        //         });
        //       }
        //     });
        //   }
        //   //  res.redirect("/userProfile/" + result[0].n_id);
        //   else {
        //     res.status(200).json({
        //       msg: "License not found",
        //       licenseInformation: [],
        //       userInformation: [],
        //     });
        //   }
        } else {
          console.log(err);
        }
      });
    });
  };