
import sql from './connection.js';

class Product {
  constructor(product) {
    if (product) {
      this.name = product.name;  // Product name
      this.sku = product.sku;  // Unique stock-keeping unit (SKU)
      this.image_url = product.image_url;  // Path to product image
      this.category = product.category;  // Product category (e.g., dairy, fruits, etc.)
      this.dosage = product.dosage;  // Quantity per serving (e.g., 2 slices, 1 cup)
      this.unit = product.unit;  // Unit of measure (e.g., cup, slice, kg)
      this.weight_per_unit = product.weight_per_unit;  // Weight of a single unit in grams
      this.calories_per_unit = product.calories_per_unit;  // Caloric value per unit
      this.serving_style = product.serving_style;  // Serving style (e.g., ground, regular)
    }
  }

  static create(newProduct) {
    return new Promise((resolve, reject) => {
      sql.query("INSERT INTO products SET ?", newProduct, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        console.log("Created product: ", { id: res.insertId, ...newProduct });
        resolve({ id: res.insertId, ...newProduct });
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM products WHERE id = ?", id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        if (res.length) {
          console.log("Found product: ", res[0]);
          resolve(res[0]);
        } else {
          reject({ kind: "not_found" });
        }
      });
    });
  }

  static findBySku(sku) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM products WHERE sku = ?", sku, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        if (res.length) {
          console.log("Found product: ", res[0]);
          resolve(res[0]);
        } else {
          reject({ kind: "not_found" });
        }
      });
    });
  }

  // This function retrieves a paginated list of products from the 'products' table, 
  // optionally filtered by category, and includes information about the total number 
  // of products and the total pages available for pagination.
  static getAll(category, page = 1, limit = 10) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM products";
      if (category) {
        query += ` WHERE category = '${category}'`;
      }
  
      if (limit != Infinity){
        const offset = (page - 1) * limit;
        query += ` LIMIT ${limit} OFFSET ${offset}`;
      }
  
      sql.query(query, (err, items) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
  
        // Get the total count of products for pagination
        let countQuery = "SELECT COUNT(*) AS total FROM products";
        if (category) {
          countQuery += ` WHERE category = '${category}'`;
        }
  
        sql.query(countQuery, (err, countResult) => {
          if (err) {
            console.log("error: ", err);
            reject(err);
            return;
          }
          //number of all products
          const total = countResult[0].total;
          const totalPages = Math.ceil(total / limit);
  
          resolve({
            items,
            page,
            totalPages,
            total
          });
        });
      });
    });
  }
  
  static update(id, product) {
    return new Promise((resolve, reject) => {
      sql.query(
        `UPDATE products 
         SET name = ?, sku = ?, image_url = ?, category = ?, dosage = ?, unit = ?, 
             weight_per_unit = ?, calories_per_unit = ?, serving_style = ? 
         WHERE id = ?`,
        [
          product.name,
          product.sku,
          product.image_url,
          product.category,
          product.dosage,
          product.unit,
          product.weight_per_unit,
          product.calories_per_unit,
          product.serving_style,
          id
        ],
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            reject(err);
            return;
          }
          if (res.affectedRows == 0) {
            reject({ kind: "not_found" });
            return;
          }
          console.log("Updated product: ", { id, ...product });
          resolve({ id, ...product });
        }
      );
    });
  }
  

  // Modify remove method to return a Promise
  static remove(id) {
    return new Promise((resolve, reject) => {
      sql.query("DELETE FROM products WHERE id = ?", id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          reject({ kind: "not_found" });
          return;
        }
        console.log("Deleted product with id: ", id);
        resolve(true);
      });
    });
  }
}

export default Product;
