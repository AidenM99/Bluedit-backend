var express = require("express");
var router = express.Router();
const signUpController = require("../controllers/signUpController");

router.post("/", signUpController.register);

module.exports = router;
