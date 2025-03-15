import ProductCrud from '../BL/product.Bl.js'
import express from 'express';
import FileUpload from '../middlewar/multerConfig.js';

const router = express.Router();

// Middleware to handle file upload in specific folder
const uploadMiddleware = FileUpload('uploads/products', ['image/jpeg', 'image/png'], 'image_url', 1, 5);

// Create a product (with image upload)
router.post('/', uploadMiddleware, ProductCrud.createProduct);

// Get a product by ID
router.get('/:id', ProductCrud.getProductById);

// Get a product by Name
router.get('/name/:name', ProductCrud.getProductByName);

// Get all products or filtered by category
router.get('/', ProductCrud.getAllProducts);

// Update product (with image upload)
router.put('/:id', uploadMiddleware, ProductCrud.updateProduct);

// Delete product by ID
router.delete('/:id', ProductCrud.removeProduct);

export default router;
