const express = require ("express");
const router = express.Router();
const { createSupplier, deleteSupplier, updateSupplier, viewAllSuppliers, viewOneSupplier} = require ("../controllers/supplier.controller")
const {verifyToken, checkRole } = require ("../middleware/auth.middleware")

router.post("/", verifyToken, checkRole("admin"), createSupplier)
router.delete("/:id", verifyToken, checkRole("admin"), deleteSupplier)
router.put("/:id", verifyToken, checkRole("admin"), updateSupplier)
router.get("/", verifyToken, viewAllSuppliers)
router.get("/:id", verifyToken, viewOneSupplier)

module.exports = router;