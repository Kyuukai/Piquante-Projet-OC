const express = require("express");
const router = express.Router();

/*const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');*/

const sauceCtrl = require('../controllers/sauceController');

router.post("/", sauceCtrl.createSauce);

module.exports = router;