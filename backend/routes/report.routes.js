const express = require ("express");
const router = express.Router();
const {salesReport, lowStock, topSellingProducts, incomeVsExpenseReport} = require("../controllers/report.controller")
const {verifyToken, checkRole } = require ("../middleware/auth.middleware")

router.get("/top-products", verifyToken, checkRole("admin"), topSellingProducts)
router.get("/sales", verifyToken, checkRole("admin", "sales_officer"), salesReport)
router.get("/low-stock", verifyToken, checkRole("admin", "sales_officer"), lowStock)
router.get("/income-expense", verifyToken, checkRole("finance_officer"), incomeVsExpenseReport)

module.exports = router;