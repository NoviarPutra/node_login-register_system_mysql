const express = require("express");

const router = express.Router();

// ROOT PAGE
router.get("/", (req, res) => res.render("./pages/welcome"));

module.exports = router;
