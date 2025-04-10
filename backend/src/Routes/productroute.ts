import { authmiddleware } from "../middlewares/tokenverify";
import { addproduct, Fetchproduct, products, updateProduct } from "../controllers/productcontrollers";

const { upload } = require("../cloud/cloudinary"); 

const express = require("express");
const router = express.Router();

router.post("/productadd", authmiddleware, upload.single("image"), addproduct);
router.get("/products",products)
router.get("/products/:id",Fetchproduct)
router.post("/products/:id", authmiddleware, upload.single("image"), updateProduct);
export default router;
  