const express = require ("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require('./db');  
dotenv.config();

const app = express();

app.use(cors({origin: "http://localhost:3000"}));

app.use(express.json());
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/customers", require("./routes/customers.routes") );
app.use("/api/suppliers", require ("./routes/supplier.routes"));
app.use("/api/transactions", require("./routes/transactions.routes"))
app.use("/api/products",  require("./routes/products.routes"))
app.use("/uploads", express.static("uploads")); 
app.use("/api/sale", require("./routes/sale.routes"))
app.use("/api/users", require("./routes/employee.routes"))
app.use("/api/reports", require("./routes/report.routes"));
module.exports = app;