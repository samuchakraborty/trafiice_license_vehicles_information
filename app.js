require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const user = require("./controller/user");
const ejs = require("ejs");
const app = express();
const police = require("./controller/police");
const admin = require("./controller/admin");
const fileUpload = require("express-fileupload");

app.use(fileUpload());

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.static("upload"));
const pool = require("./database/database.js");


///api  user
app.post("/user/singup", user.signUpForUser);
app.post("/user/signin", user.signInForUser);
app.post("/user/applyLicense", user.applyForLicense);
app.post('/user/addVechile', user.addYourVechileNumber);
app.get('/user/getVechile/:nid', user.getVechileInformation);
app.get("/user/userProfile/:nid", user.getUserInformation);
app.post("/user/userPayment", user.paymentStatus);
app.post("/user/userReport", user.stolenVehicle);



///api police
app.post("/police/signIn", police.signInPolice);
app.post("/police/signUp", police.signUpForPolice);
app.get("/police/getInformation", police.getPoliceInformation);
app.get("/police/getLicense", police.getLicenseInformation);
app.get("/police/getVehicle", police.getVehicleInformation);



//api admin
app.get("/admin/user", admin.getLicenseInformation);

app.get("/admin/vehicle", admin.getVehicleInformation);

app.post("/admin/login", admin.signInForAdmin);

app.post("/admin/updateLicense", admin.updateLicenseInformation);



app.listen(port, () => {
  console.log("listening to the server on port " + port);
});
