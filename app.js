const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const bodyparser = require("body-parser");
const session = require("express-session");
const app = express();

// STATIC FILE
app.use(express.static(path.join(__dirname, "public")));

// BODY-PARSER
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// SESSION
app.use(
  session({
    secret: "anonymous",
    resave: true,
    saveUninitialized: true
  })
);

// VIEW
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ROUTER
app.use("/", require("./routes/index"));
app.use("/", require("./routes/user"));

// PAGE NOT FOUND : 404
app.use((req, res, next) => {
  let err = new Error("Page Not Found Lur !");
  err.status = 404;
  next(err);
});

// HANDLING ERROR
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// LOCALHOST
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
