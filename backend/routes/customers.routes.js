const express = require ("express");
const router = express.Router();
const { createCustomer, deleteCustomer, updateCustomer, viewAllCustomers, viewOneCustomer} = require ("../controllers/customer.controller")
const {verifyToken, checkRole } = require ("../middleware/auth.middleware")

router.post ("/", verifyToken, checkRole("admin", "sales_officer"),  createCustomer)
router.delete("/:id", verifyToken, checkRole("admin"), deleteCustomer)
router.put("/:id", verifyToken, checkRole("admin", "sales_officer"), updateCustomer)
router.get("/", verifyToken, viewAllCustomers)
router.get("/:id", verifyToken, viewOneCustomer)

module.exports = router;