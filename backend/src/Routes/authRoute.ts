import {  getAllUsers, userlogin, userregister } from "../controllers/authcontrollers"
import authratelimit from "../ratelimiter/ratelimiter"

const express = require("express")
const authRoute = express.Router()

authRoute.post("/userregister",userregister)
authRoute.post("/userlogin",authratelimit,userlogin)
authRoute.get("/users",authratelimit,getAllUsers)

export default authRoute  