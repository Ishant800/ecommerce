import { Response,Request } from "express"
import pool from '../database/database'

import { fetchproduct, getproducts, Product, redisClient, updateProducts } from "../models/user";


export const addproduct = async (req:Request,res:Response)=>{

    try {
        const {productname,description,brand,price,stock} = req.body
  
        const image = (req as any).file?.path;
      
        if(!productname || !image || !description || !brand  || !price || !stock) return res.status(400).json({error:"all fields are mendatory"})

      const [product]:any =  await pool.query("INSERT INTO products(productname,image,description,brand,price,stock) VALUES(?,?,?,?,?,?)",[productname,image,description,brand,price,stock])
     
      if(product.affectedRows > 0) return res.status(200).json({message:"product add sucessfully",product})
      else return res.status(400).json({error:"product add failed"})
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"internal error" })
    }
}



export const products = async(req:Request,res:Response)=>{
    try {
  const key = "products"
    const data = await redisClient.get(key)

    if(data !== null){
        console.log("cached data hit")
        return res.json(JSON.parse(data))
    }
    else{
    console.log("data not found in redis")
     }
       const rows = await getproducts()
       if(rows.length > 0){
        await redisClient.setEx("products",60,JSON.stringify(rows))
        return res.status(200).json({rows}) 
       } 
    } catch (error) {
        return res.status(400).json({error})
    }
}

export const Fetchproduct = async (req:Request,res:Response)=>{
    try {
        const id = Number(req.params.id)
        const key = `product:${id}`
       const products = await redisClient.get(key)
     if(products !== null){
        console.log("data found in cached")
        return res.json(JSON.parse(products))
     }
     else{
        console.log("cached not found")
     }

        const product = await fetchproduct(id)
         if(product.length > 0) {
            await redisClient.setEx(key,120,JSON.stringify(product))
            return res.status(200).json({product}) } 
    } catch (error) {
        console.log(error)
        return res.status(400).json({"error":"internal server error"})
    }}



export const updateProduct = async (req:Request,res:Response)=>{
    try {
        const id = Number(req.params.id)
        const updates :Partial<Product> = req.body


         const sucess = await updateProducts(id,updates)
         if(sucess) return res.status(200).json({"message":"product update sucessfully"})
   
        
    } catch (error) {
        
    }
}

//redis test 
// const testredis =async()=>{
//     try {
//         const otp = await redisClient.setEx("otp:123",120,"567")
       
//     } catch (error) {
//       console.log(error)  
//     }
// }
//  const otptime = async()=>{
//     try {
//         const timeleft = await redisClient.ttl("otp:123")
//          console.log("time left: ",timeleft)
           
//     } catch (error) {
//       console.log(error)  
//     }
//  }

//  testredis()
//  setTimeout(()=>{
//     otptime()
//  },3000)
//  setTimeout(()=>{
//     otptime()
//  },4000)


//  const redis = async()=>{
//     try {
//          await redisClient.set("page_viewed","0")
//         await redisClient.incr("page_viewed")
//         await redisClient.incr("page_viewed")

//        const count = await redisClient.get("page_viewed")
//         console.log("page_viewed: ",count)
//     await redisClient.decr("page_viewed")
//     const getdata = await redisClient.get("page_viewed")
//     console.log("page-viewed: ",getdata)
        
//     } catch (error) {
//        console.log(error) 
//     }
//  }

//  redis()


//  //update existing value in redis
//  const updatevalue = async()=>{
//     await redisClient.set("message","hello world")
  
//     await redisClient.append("message","world")
   
    

//     const data =await redisClient.get("message")
//     console.log(data)
//  }
//  updatevalue()


// const addOnlineuser = async (userId:string)=>{
//     await redisClient.sAdd("onlineuser",userId)
// }

// const isuserOnline = async (userId:string):Promise<boolean>=>{
//     const result = await redisClient.sIsMember("onlineuser",userId);
//     return result === 1;
    
// }


import Redis from 'ioredis'

export const publisher = new Redis()
export const subscriber = new Redis()

// const CHANNEL = "notification"


// export const setUpSubscriver =()=>{
//     subscriber.subscribe(CHANNEL)

//     subscriber.on("message",(channel,message)=>{
//         console.log("received message "+message + "from channel " + channel)
//     })
// }



// export const sendNotification = async(msg:string)=>{
//     await publisher.publish(CHANNEL,msg)
// }

export const sendEmail = async(to:string,subject:string,body:string)=>{
    console.log(`email to ${to} : ${subject}- ${body}` )
}

export const notifyAdmin = async (message: string) => {
    console.log(`⚠️ [ADMIN ALERT]: ${message}`);
  };
  
  export const listenToUserEvents = () => {
    subscriber.subscribe("user:activity");
  
    subscriber.on("message", async (channel, message) => {
      const data = JSON.parse(message);
  
      if (data.type === "login") {
        await sendEmail(data.email, "Login Alert", `You logged in on ${data.time}`);
        
        if(data.role === "admin"){
            await notifyAdmin(`User ${data.name} (${data.email}) just logged in.`);
        }
        
      }
  
      if (data.type === "signup") {
        await sendEmail(data.email, "Welcome!", `Thanks for signing up on ${data.time}`);
        await notifyAdmin(`New signup: ${data.name} (${data.email})`);
      }
    });
  };