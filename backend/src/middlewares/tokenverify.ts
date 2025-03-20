import { Response,Request,NextFunction } from "express"
const jwt = require('jsonwebtoken')

declare module "express" {
    export interface Request {
      user?: any; // You can replace 'any' with a proper User type
    }
  }


export const authmiddleware = async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.acesstoken
    console.log(token)
    if(!token) return res.status(400).json({message:"token not provided"})
    try {
    
  
        const decode =await jwt.verify(token,process.env.SECRETE_KEY as string) as {id:number,role:string}
        if(!decode) return res.status(400).json({error:"token not decodeed"})

      const user = decode
        if(user.role as any !== 'admin') return res.status(400).json({error:"acess denied"})
              req.user = decode
         next()

  } catch (error) {
    return res.status(400).json({error:"invalid token"})
  }}


  export const tokenvalid = async (req:Request,res:Response,next:NextFunction)=>{
   
    if(!req.cookies.acesstoken) return res.status(400).json({error:"no token received"})

    try {
        const isvalid = await jwt.verify(req.cookies.acesstoken,process.env.SECRETE_KEY)
        if(!isvalid) return res.status(400).json({error:"token not valid"})
      next()
    } catch (error) {
        return res.status(400).json({error:"token invalid"})
    }
  }