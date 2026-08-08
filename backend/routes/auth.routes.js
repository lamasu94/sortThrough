
const express = require("express");
const router = express.Router();
const { login, register,   getProfile, updateProfile, changePassword } = require("../controllers/auth.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");
const upload = require("../middleware/uploadAvatars.middleware");

router.post("/login", login);
router.post("/register", verifyToken, checkRole("admin"), upload.single("image"), register);
router.put("/profile", verifyToken, upload.single("image"), updateProfile)
router.get("/profile", verifyToken, getProfile)
router.put("/change-password", verifyToken, changePassword)

module.exports = router;