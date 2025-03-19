const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/authentication", require("./src/routes/jwtAuth"));
app.use("/dashboard", require("./src/routes/dashboard"));

module.exports = app; // ส่งออก app เพื่อใช้ใน Jest