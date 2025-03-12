import Product from '../DL/product.dl.js'
import FileHandler from '../utils/fileHandler.js'

/**
 * product service:
 * creat
 * update by id (name still the same)
 * remove
 * get all
 * get by id
 * get by name
 */
class ProductCrud {

  static async createProduct(req, res) {
    // Ensure product data is valid (basic check)
    if (!req.body.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Trim and lowercase the name to prevent case sensitivity issues
    const productName = req.body.name.trim().toLowerCase();

    const products_list = await Product.getAll();
    if(products_list.find((product) => productName === req.body.name)){
      return res.status(400).json({ error: 'Product already exists' });
    }
    try {
      const product = new Product({
        name: productName,
        category: req.body.category,
        unit: req.body.unit,
        measure_by_unit: req.body.measure_by_unit,
        image_url: req.file ? req.file.filename : null
      });

      // Create product in DL layer
      const newProduct = await Product.create(product);
      res.status(201).json(newProduct);

    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      res.json(product);
    } catch (error) {
      if (error.kind === "not_found") {
        return res.status(404).json({ error: 'Product not found' });
      }
      console.error(`Error fetching product by ID (${req.params.id}):`, error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductByName(req, res) {
    try {
      const productName = req.params.name;
      const product = await Product.findByName(productName);
      res.json(product);
    } catch (error) {
      if (error.kind === "not_found") {
        return res.status(404).json({ error: 'Product not found' });
      }
      console.error('Error fetching product by name:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const category = req.query.category;
      const products = await Product.getAll(category);
      res.json(products);
    } catch (error) {
      console.error('Error fetching all products:', error);
      res.status(500).json({ error: error.message });
    }
  }

  //update a product. name still the same
  static async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const existingProduct = await Product.findById(productId);

      // Delete old image if it exists and a new one is uploaded
      if (req.file && existingProduct.image_url) {
        await FileHandler.deleteFile(`uploads/products/${existingProduct.image_url}`);
      }

      const updatedProduct = new Product({
        name: existingProduct.name,
        category: req.body.category,
        unit: req.body.unit,
        measure_by_unit: req.body.measure_by_unit,
        image_url: req.file ? req.file.filename : null
      });

      const updated = await Product.update(productId, updatedProduct);
      res.json(updated);

    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async removeProduct(req, res) {
    try {
      const productId = req.params.id;
      const existingProduct = await Product.findById(productId);

      // Delete file if it exists
      if (existingProduct.image_url) {
        await FileHandler.deleteFile(`uploads/products/${existingProduct.image_url}`);
      }

      await Product.remove(productId);
      res.json({ message: 'Product deleted successfully' });

    } catch (error) {
      if (error.kind === "not_found") {
        return res.status(404).json({ error: 'Product not found' });
      }
      console.error('Error deleting product:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProductCrud;
