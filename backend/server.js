const express = require('express');
const cors = require('cors'); 
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app= express();

app.use(cors());
app.use(express.json());

connectDB();
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running http://localhost:${process.env.PORT}`);
})
