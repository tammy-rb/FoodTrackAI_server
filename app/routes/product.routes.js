import express from "express";
import ProductCrud from "../BL/product.Bl.js"
import FileUpload from"../middlewar/multerConfig.js"
import validateProduct from "../middlewar/ValidateProduct.js"
import convertEmptyStringsToNull from "../middlewar/ConvertEmptyStringsToNull.js";
import { FOOD_CATEGORIES, UNITS } from "../globals.js";

const router = express.Router();

// Middleware for file uploads (accepts only JPG/PNG images)
const uploadMiddleware = FileUpload("uploads/products", ["image/jpeg", "image/png"], "image_url", 1, 5);

// Create a product (with validation & image upload)
router.post("/", uploadMiddleware, convertEmptyStringsToNull, validateProduct, ProductCrud.createProduct);

// Get the list of categories
router.get("/categories", (req, res) => {
    res.json(FOOD_CATEGORIES);
  });
  
  // Get the list of unit types
  router.get("/units", (req, res) => {
    res.json(UNITS);
  });

  // Get a product by ID
router.get("/:id", ProductCrud.getProductById);

// Get a product by SKU
router.get("/sku/:sku", ProductCrud.getProductBySku);

// Get all products (optional category filter)
router.get("/", ProductCrud.getAllProducts);

// Update a product (with validation & image upload)
router.put("/:id", uploadMiddleware, convertEmptyStringsToNull, validateProduct, ProductCrud.updateProduct);

// Delete a product by ID
router.delete("/:id", ProductCrud.removeProduct);

export default router;
