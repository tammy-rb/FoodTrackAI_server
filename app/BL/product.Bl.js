import Product from '../DL/product.dl.js'
import FileHandler from '../utils/fileHandler.js'

class ProductCrud {

  // Save product in SQL products table, save the file in products folder.
  static async createProduct(req, res) {
    // Ensure product data is valid (basic check)
      if (!req.body.name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
    try {
      const product = new Product({
        name: req.body.name,
        category: req.body.category,
        unit: req.body.unit,
        measure_by_unit: req.body.measure_by_unit,
        // If an image is provided, store it in 'products' folder
        image_url: req.file ? req.file.filename : null
      });

      // Create product in DL layer, ensuring proper error handling
      Product.create(product, (err, newProduct) => {
        if (err) {
          console.error('Error creating product:', err);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(newProduct);
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const productId = req.params.id;
      Product.findById(productId, (err, product) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(404).json({ error: 'Product not found' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.json(product);
      });
    } catch (error) {
      console.error(`Error fetching product by ID (${req.params.id}):`, error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductByName(req, res) {
    try {
      const productName = req.params.name;
      Product.findByName(productName, (err, product) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(404).json({ error: 'Product not found' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.json(product);
      });
    } catch (error) {
      console.error('Error fetching product by name:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const category = req.query.category;
      Product.getAll(category, (err, products) => {
        if (err) {
          console.error('Error fetching all products:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json(products);
      });
    } catch (error) {
      console.error('Error fetching all products:', error);
      res.status(500).json({ error: error.message });
    }
  }

  //update existing product.
  //find the older, remove its image if exist. 
  //save the new and save its image.
  static async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const existingProduct = null;
      Product.findById(productId, (err, existingProduct) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(404).json({ error: 'Product not found' });
          }
          return res.status(500).json({ error: err.message });
        }

        //delete old file if theres new one
        if (req.file && existingProduct.image_url) {
          await FileHandler.deleteFile( `uploads\product\\${existingProduct.image_url}`);
        }});

        //make new updated product. after we found the old one.
        const updatedProduct = new Product({
          name: req.body.name,
          category: req.body.category,
          unit: req.body.unit,
          measure_by_unit: req.body.measure_by_unit,
          // If an image is provided, store it in 'products' folder
          image_url: req.files ? req.file?.filename :  null
        });

        Product.update(productId, updatedProduct, (updateErr, result) => {
          if (updateErr) {
            console.error('Error updating product:', updateErr);
            return res.status(500).json({ error: updateErr.message });
          }
          res.json(result);
        });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  }

  //remove product by its id from products table.
  //also, remove its file from /products folder if exist
  static async removeProduct(req, res) {
    try {
      const productId = req.params.id;
      Product.findById(productId, (err, existingProduct) => {
        if (err || !existingProduct) {
          if (err?.kind === "not_found") {
            return res.status(404).json({ error: 'Product not found' });
          }
          return res.status(500).json({ error: err.message });
        }

        if (existingProduct.image_url) {
          await FileHandler.deleteFile( `uploads\products\\${existingProduct.image_url}`);
        }

        Product.remove(productId, (removeErr, success) => {
          if (removeErr) {
            console.error('Error deleting product:', removeErr);
            return res.status(500).json({ error: removeErr.message });
          }
          res.json({ message: 'Product deleted successfully' });
        });
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProductCrud;
