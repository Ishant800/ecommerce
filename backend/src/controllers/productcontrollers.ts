import { Response,Request } from "express"
import pool from '../database/database'


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

export const products = async (req:Request,res:Response)=>{
    try {
        const [product] = await pool.execute("SELECT * FROM products")
        if(product ) return res.status(200).json({product:product})
    } catch (error) {
        return res.status(401).json({error:"no product found"})
    }
}

