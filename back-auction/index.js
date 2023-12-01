import express from 'express'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from '../back-auction/Routes/userRoutes.js'
import cors from 'cors'
import listingRouter from '../back-auction/Routes/listingRoutes.js'
import cookieParser from 'cookie-parser';
import path from "path"



dotenv.config();


const __dirname = path.resolve();

const app = express();


const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,
    exposedHeaders: ["set-cookie"]
  };
  app.options('*', cors(corsOptions));
  
  app.use(cors(corsOptions));
  
app.use(express.json());
app.use(cookieParser());


const MONGO_URI = process.env.MONGO;

async  function connectToMoongose() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}



app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use(express.static(path.join(__dirname, 'front-end-auction/dist')));
app.get('*',(req, res)=>{
  res.sendFile(path.join(__dirname, 'front-end-auction', 'dist', 'index.html'));
})

app.listen(7000, ()=>{
    console.log("Port listen in 7000")
})

connectToMoongose();

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });