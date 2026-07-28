const express = require ("express");
const router = express.Router();
const { createTransaction, deleteTransaction, updateTransaction, viewAllTransactions, viewOneTransaction} = require ("../controllers/transaction.controller")
const {verifyToken, checkRole } = require ("../middleware/auth.middleware")

router.post("/", verifyToken, checkRole("finance_officer"), createTransaction)
router.delete("/:id", verifyToken, checkRole("finance_officer"), deleteTransaction)
router.put("/:id", verifyToken, checkRole("finance_officer"), updateTransaction)
router.get("/", verifyToken, checkRole("finance_officer", "admin"), viewAllTransactions)
router.get("/:id", verifyToken, checkRole("finance_officer", "admin") , viewOneTransaction)

module.exports = router;