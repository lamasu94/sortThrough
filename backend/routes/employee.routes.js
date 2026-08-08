const express = require("express");
const router = express.Router();
const {updateEmployee, deleteEmployee, viewOneEmployee, viewAllEmployees} = require("../controllers/employee.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.put("/:id", verifyToken, checkRole("admin"), updateEmployee)
router.delete("/:id", verifyToken, checkRole("admin"), deleteEmployee)
router.get("/", verifyToken, checkRole("admin"), viewAllEmployees)
router.get("/:id", verifyToken, checkRole("admin"), viewOneEmployee)

module.exports = router;
