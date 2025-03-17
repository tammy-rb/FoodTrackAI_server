import Product from '../DL/product.dl.js';
import FileHandler from '../utils/fileHandler.js';

const path_to_files = 'uploads/products/';

class ProductCrud {

  static async createProduct(req, res) {
    try {
      // Check if SKU already exists
      const existingProduct = await Product.findBySku(req.body.sku);
      if (existingProduct) {
        return res.status(400).json({ error: "Product with this SKU already exists" });
      }
  
      // Create new product object
      const product = new Product({
        ...req.body,
        image_url: req.file ? path_to_files + req.file.filename : null
      });
  
      // Create the product
      const newProduct = await Product.create(product);
      res.status(201).json(newProduct);
      
    } catch (error) {
      // if the error meaning not found another object with this sku, make the object and return success
      if (error.kind === "not_found") {
        // Create new product object
        const product = new Product({
          ...req.body,
          image_url: req.file ? path_to_files + req.file.filename : null
        });
    
        // Create the product
        const newProduct = await Product.create(product);
        res.status(201).json(newProduct);
      } else {
        console.error("Error creating product:", error);
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      res.json(product);
    } catch (error) {
      if (error.kind === "not_found") {
        return res.status(404).json({ error: "Product not found" });
      }
      console.error("Error fetching product by ID:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductBySku(req, res) {
    try {
      const product = await Product.findBySku(req.params.sku.trim().toUpperCase());
      res.json(product);
    } catch (error) {
      if (error.kind === "not_found") {
        return res.status(404).json({ error: "Product not found" });
      }
      console.error("Error fetching product by SKU:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const { category, page = 1, limit = 10 } = req.query;
      const products = await Product.getAll(category, parseInt(page), parseInt(limit));
      res.json(products);
    } catch (error) {
      console.error("Error fetching all products:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const existingProduct = await Product.findById(productId);

      // Delete old image if a new one is uploaded
      if (req.file && existingProduct.image_url) {
        await FileHandler.deleteFile(existingProduct.image_url);
      }

      // If SKU is being changed, check for conflicts
      if (req.body.sku && req.body.sku !== existingProduct.sku) {
        const existingProductWithSku = await Product.findBySku(req.body.sku);
        if (existingProductWithSku && existingProductWithSku.id !== parseInt(productId)) {
          return res.status(400).json({ error: "Product with this SKU already exists" });
        }
      }

      const updatedProduct = {
        ...req.body,
        image_url: req.file ? path_to_files + req.file.filename : existingProduct.image_url
      };

      const updated = await Product.update(productId, updatedProduct);
      res.json(updated);
    } catch (error) {
      if (error.kind === "not_found") {
        return res.status(404).json({ error: "Product not found" });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async removeProduct(req, res) {
    try {
      const productId = req.params.id;
      const existingProduct = await Product.findById(productId);

      if (existingProduct.image_url) {
        await FileHandler.deleteFile(existingProduct.image_url);
      }

      await Product.remove(productId);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      if (error.kind === "not_found") {
        return res.status(404).json({ error: "Product not found" });
      }
      console.error("Error deleting product:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProductCrud;
