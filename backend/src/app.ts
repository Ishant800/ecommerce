
const pool = require('./database/database')
const express = require('express')
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
import cookieParser from 'cookie-parser'
import authRoute from './Routes/authRoute'
import router from './Routes/productroute'
app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true,
  }));
  
app.use(express.json())
app.use(cookieParser())

//database integration
pool
app.use("/user",authRoute)
app.use("/product",router)

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`server run on port ${port}`)
})
 