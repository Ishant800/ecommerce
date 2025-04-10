// src/app.ts
// import express from 'express';]
export const express = require('express')
import pool from './database/database';
import Redis from 'ioredis';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './Routes/authRoute';
import router from './Routes/productroute';
import { listenToUserEvents } from './controllers/productcontrollers';

dotenv.config();

export const app = express();

// Redis setup
export const publisher = new Redis();
export const subscriber = new Redis();

// Middlewares
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true,
}));
app.use(express.json()); 
app.use(cookieParser());

// DB pool
pool;

// Routes
app.use("/user", authRoute);
app.use("/product", router);

// Redis events
listenToUserEvents();
