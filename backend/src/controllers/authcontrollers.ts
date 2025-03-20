import { Request,Response } from "express"
import pool from '../database/database'
import  User  from "../models/user";
import { RowDataPacket } from "mysql2";

const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

export const userregister = async (req: Request, res: Response) => {
    try {
        const { username, email, password ,role} = req.body;

        // Check if user already exists
        const [userExists]: any = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Insert user and log the result
        const [result]: any = await pool.query(
            "INSERT INTO user (username, email, password,role) VALUES (?,?, ?, ?)",
            [username, email, hashedPassword,role]
        );

        console.log("Insert Query Result:", result); // ✅ Debugging

        if (result.affectedRows > 0) {
            return res.status(201).json({ message: "User registered successfully" });
        } else {
            return res.status(400).json({ message: "Registration failed, no rows affected" });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ error:"Server error during registration" });
    }
};


export const userlogin = async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Query the database for the user
        const [rows]: any = await pool.query("SELECT * FROM user WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Email not registered yet" });
        }

        const user = rows[0];

        // Compare passwords
        const ismatched = await bcrypt.compare(password, user.password);
        if (!ismatched) {
            return res.status(401).json({ message: "Password not matched" });
        }

        // Generate JWT token

        const acesstoken = jwt.sign({ id: user.id, role: user.role }, process.env.SECRETE_KEY as string, { expiresIn: '2d' });

const token = jwt.sign(
  { username: user.username, email: user.email },
  process.env.SECRETE_KEY as string,
  { expiresIn: '2d' }
);

// Send response with user details and token
return res.status(200)
  .cookie("acesstoken", acesstoken, { httpOnly: true, secure: true })
  .json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });


    } catch (error) {
        console.error("Login error:", error);
        return res.status(400).json({ message: "User login failed", error });
    }
};
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<User[] & RowDataPacket[]>("SELECT * FROM user");
        res.status(200).json({ users: rows });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};