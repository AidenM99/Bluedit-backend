var express = require("express");
var router = express.Router();
const logInController = require("../controllers/logInController");

router.post("/", logInController.authenticate);

module.exports = router;
