const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauceController');

router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, multer, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);
router.get("/", auth, multer, sauceCtrl.getAllSauces);

module.exports = router;