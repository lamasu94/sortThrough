
const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/auth.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");
const upload = require("../middleware/uploadAvatars.middleware");

router.post("/login", login);
router.post("/register", verifyToken, checkRole("admin"),upload.single("image"), register);

module.exports = router;