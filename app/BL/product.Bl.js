import Product from '../DL/product.dl';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use these two lines to get the equivalent of __dirname- get the file url, convert it to directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hwCrud = {};

// Create and Save a new homework
hwCrud.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const homework = new Hw({
    lesson_id: req.body.lesson_id,
    file_name : req.file?.filename ?? null,
    description: req.body.description
  });

  Hw.create(homework, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the homework"
      });
    else res.send(data);
  });
};

// Retrieve all homeworks from the database (with condition).
hwCrud.findAll = (req, res) => {
  const lesson = req.query.lesson;
  Hw.getAll(lesson, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving homeworks."
      });
    } else res.send(data);
  });
};

// Find a single hw by Id
hwCrud.findOne = (req, res) => {
  Hw.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving homework with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a homework identified by the id in the request
hwCrud.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Hw.findById(req.params.id,async (err, oldData) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving homework with id " + req.params.id
        });
      }
    } else {
      let newFileName = oldData.file_name;
      if (req.file) {
        // Delete the old file
        if (oldData.file_name) {
          const filePath = path.join(__dirname, '../../public/hw/files', oldData.file_name);
          await fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete old file:", err);
          });
        }
        newFileName = req.file.filename;
      }

      const homework = new Hw({
        lesson_id: req.body.lesson_id,
        file_name: newFileName,
        description: req.body.description
      });

      Hw.updateById(req.params.id, homework, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found homework with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating homework with id " + req.params.id
            });
          }
        } else res.send(data);
      });
    }
  });
};

// Delete a homework with the specified id in the request
hwCrud.delete = (req, res) => {
  Hw.findById(req.params.id, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving homework with id " + req.params.id
        });
      }
    } else {
      // Delete the file
      if (data.file_name) {
        const filePath = path.join(__dirname, '../../public/hw/files', data.file_name);
        await fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }

      Hw.remove(req.params.id, (err, result) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found homework with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete homework with id " + req.params.id
            });
          }
        } else res.send({ message: `Homework was deleted successfully!` });
      });
    }
  });
};

// Delete all homeworks from the database.
hwCrud.deleteAll = (req, res) => {
  // Delete all files from the hw/files directory
  const directoryPath = path.join(__dirname, '../../public/hw/files');
  fs.readdir(directoryPath,(err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      res.status(500).send({
        message: "Error listing files in directory."
      });
    } else {
      files.forEach(async (file, index) => {
        const filePath = path.join(directoryPath, file);
        await fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      });
    }
  });

  Hw.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all homeworks."
      });
    else res.send({ message: `All homeworks were deleted successfully!` });
  });
};


export default hwCrud;

import Product from "../DL/product.js";  // Data Layer
import fileHandler from "../utils/fileHandler.js";  // File handling utility

class ProductCrud {
  /**
   * Create a new product, handling optional image upload
   */
  static async createProduct(data, file) {
    try {
      if (file) {
        // Save file and get its URL
        const imageUrl = await fileHandler.saveFile(file);
        data.image_url = imageUrl; 
      }

      return new Promise((resolve, reject) => {
        Product.create(new Product(data), (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    } catch (error) {
      throw new Error("Error creating product: " + error.message);
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id) {
    return new Promise((resolve, reject) => {
      Product.findById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * Get product by name
   */
  static async getProductByName(name) {
    return new Promise((resolve, reject) => {
      Product.findByName(name, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * Get all products or filter by category
   */
  static async getAllProducts(category = null) {
    return new Promise((resolve, reject) => {
      Product.getAll(category, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * Update product details, optionally handling new image upload
   */
  static async updateProduct(id, data, file) {
    try {
      if (file) {
        // Save new file and update image URL
        const imageUrl = await fileHandler.saveFile(file);
        data.image_url = imageUrl;
      }

      return new Promise((resolve, reject) => {
        Product.update(id, data, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  /**
   * Delete a product by ID
   */
  static async deleteProduct(id) {
    return new Promise((resolve, reject) => {
      Product.remove(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

export default ProductCrud;
