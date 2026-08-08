const express = require("express");
const router = express.Router();
const { createSale, viewAllSales, viewOneSale } = require("../controllers/sale.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");


router.get("/", verifyToken, checkRole("admin", "sales_officer"), viewAllSales);
router.get("/:id", verifyToken, checkRole("admin", "sales_officer"), viewOneSale);


router.post("/", verifyToken, checkRole("sales_officer"), createSale);

module.exports = router;