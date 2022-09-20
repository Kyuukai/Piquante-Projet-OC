const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauceController');

router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, multer, sauceCtrl.sauceLikeDislike);

router.put("/:id", auth, multer, sauceCtrl.modifySauce);

router.delete("/:id", auth, multer, sauceCtrl.deleteSauce);

module.exports = router;