import { createClient } from "redis";
import { RowDataPacket ,ResultSetHeader} from "mysql2";
import pool from '../database/database'
import { express } from "../app";
// import {app}  from "../app";

export default interface User extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}
// app.use(express.json())

export const redisClient = createClient();
(async()=>{
    await redisClient.connect().catch(err=>console.log(err as string))
    console.log("redis connected")
})()

export  interface Product extends RowDataPacket{
    id:number,
    productname:string,
    price:number,
    stock:string,
    categories:string,
    image:string,
    description:string,
    reviews:string,
    brand:string
}



export  const getproducts =async():Promise<Product[]>=>{
const [rows] = await pool.query<Product[] & RowDataPacket[]>("SELECT * FROM products LIMIT 100")
await redisClient.setEx("products", 60, JSON.stringify(rows));

return rows 

}


export const fetchproduct = async(id:number):Promise<Product[]>=>{
    
    const [rows] = await pool.query<Product[]>("SELECT * FROM products WHERE ID = ?",[id])
    return rows as Product[]
}


export const updateProducts = async (id: number, updates: Partial<Product>): Promise<boolean> => {
    try {
        // 🔹 Extract only provided fields (avoid undefined)
        const { productname, price, stock, categories, image, description, brand } = updates;

        // 🔹 Execute the query
        const [result] = await pool.query<ResultSetHeader>(
            "UPDATE products SET productname = ?, price = ?, stock = ?, categories = ?, image = ?, description = ?, brand = ? WHERE id = ?",
            [productname, price, stock, categories, image, description, brand, id]
        );

        // 🔹 Return true if update was successful
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating product:", error);
        return false;
    }
};