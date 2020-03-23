const express = require("express");
const mysql = require("mysql");
const hash = require("password-hash");

const router = express.Router();

// DB CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_login"
});

// CONNECT TO MYSQL
db.connect(err => {
  if (err) throw err;
  console.log("CONNECTED TO DATABASE ...");
});

// GET DASHBOARD
router.get("/dashboard", (req, res) => {
  if (req.session.login) {
    res.render("./pages/dashboard");
  } else {
    res.json({ STATUS: "KUDU LOGIN BANG !!!" });
  }
});

// GET LOGIN
router.get("/login", (req, res) => res.render("./pages/login"));

// GET REGISTER
router.get("/register", (req, res) => res.render("./pages/register"));

// POST LOGIN PAGE
router.post("/login", (req, res) => {
  let dataLogin = {
    email: req.body.email,
    password: req.body.password
  };
  let sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, dataLogin.email, (err, result) => {
    for (let i = 0; i < result.length; i++) {
      let verifyPass = hash.verify(dataLogin.password, result[i].password);
      req.session.login = true;
      if (verifyPass) {
        res.redirect("/dashboard");
      } else {
        console.log("Password Salah");
      }
    }
  });
});

// POST REGISTER
router.post("/register", (req, res) => {
  let dataRegister = {
    name: req.body.name,
    email: req.body.email,
    password: hash.generate(req.body.password)
  };
  let sqlReg = "SELECT * FROM users WHERE email ?";
  db.query(sqlReg, dataRegister.email, (err, result) => {
    // HANDLING IF EXIST
    if (result) {
      console.log("Data Sudah Ada !!!");
    } else {
      let insQuery = "INSERT INTO users SET ?";
      db.query(insQuery, dataRegister, (err, result) => {
        res.redirect("/login");
      });
    }
  });
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.login = false;
  res.redirect("/");
});
module.exports = router;
