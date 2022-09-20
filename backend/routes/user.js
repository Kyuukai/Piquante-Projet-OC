const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const passwordVerification = require("../middleware/passwordVerification");

router.post("/signup", passwordVerification, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;