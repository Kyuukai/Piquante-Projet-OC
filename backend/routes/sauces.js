const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauceController');

router.post("/sauces", auth, multer, sauceCtrl.createSauce);
router.get("/sauces/:id", auth, multer, sauceCtrl.getOneSauce);
router.put("/sauces/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/sauces/:id", auth, multer, sauceCtrl.deleteSauce);
router.get("/sauces", auth, multer, sauceCtrl.getAllSauces);

module.exports = router;