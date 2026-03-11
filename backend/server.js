const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); 
dotenv.config();
connectDB();


const app= express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT,()=>{
    console.log(`Server is running http://localhost:${process.env.PORT}`);
})
