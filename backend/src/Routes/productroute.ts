import { authmiddleware } from "../middlewares/tokenverify";
import { addproduct, products } from "../controllers/productcontrollers";
// ✅ Correct Import
const { upload } = require("../cloud/cloudinary"); // Use require()

const express = require("express");
const router = express.Router();

router.post("/productadd", authmiddleware, upload.single("image"), addproduct);
router.get("/products",products)
export default router;
