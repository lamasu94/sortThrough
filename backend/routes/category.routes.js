const express = require("express")
const router = express.Router();
const {createCategory, deleteCategory, updateCategory, viewAllCategory, viewOneCategory} = require ("../controllers/category.controller")
const { verifyToken, checkRole } = require("../middleware/auth.middleware");


router.post("/", verifyToken, checkRole("admin"), createCategory)
router.delete("/:id", verifyToken, checkRole("admin"), deleteCategory)
router.put("/:id", verifyToken, checkRole("admin"), updateCategory)
router.get("/", verifyToken, viewAllCategory)
router.get("/:id", verifyToken,  viewOneCategory)

module.exports = router;