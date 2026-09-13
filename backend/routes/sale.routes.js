const express = require("express");
const router = express.Router();
const { createSale, viewAllSales, viewOneSale } = require("../controllers/sale.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");


router.get("/", verifyToken, viewAllSales);
router.get("/:id", verifyToken, viewOneSale);
router.post("/", verifyToken, checkRole("sales_officer", "admin"), createSale);

module.exports = router;