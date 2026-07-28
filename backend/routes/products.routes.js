const express = require ("express");
const router = express.Router();
const { createProduct, deleteProduct, updateProduct, viewAllProduct, viewOneProduct} = require ("../controllers/supplier.controller")
const {verifyToken, checkRole } = require ("../middleware/auth.middleware")
const upload = require("../middleware/uploadProducts.middleware");


router.post( "/", verifyToken, checkRole("admin"), upload.single("image") , createProduct)
router.delete("/:id", verifyToken, checkRole("admin"), deleteProduct)
router.put("/:id", verifyToken, checkRole("admin"), upload.single("image"), updateProduct)
router.get("/", verifyToken, viewAllProduct)
router.get("/:id", verifyToken, viewOneProduct)