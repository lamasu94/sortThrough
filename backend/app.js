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

module.exports = app;