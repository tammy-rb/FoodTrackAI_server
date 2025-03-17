
import sql from './connection.js';

class Product {
  constructor(product) {
    if (product) {
      this.name = product.name;
      this.image_url = product.image_url;
      this.category = product.category;
      this.unit = product.unit;
      this.measure_by_unit = product.measure_by_unit;
    }
  }

  // Modify create method to return a Promise
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

  // Modify findById method to return a Promise
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

  // Modify findByName method to return a Promise
  static findByName(name) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM products WHERE name = ?", name, (err, res) => {
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
  
      sql.query(query, (err, products) => {
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
            products,
            page,
            totalPages,
            total
          });
        });
      });
    });
  }
  

  // Modify update method to return a Promise
  static update(id, product) {
    return new Promise((resolve, reject) => {
      sql.query(
        "UPDATE products SET name = ?, image_url = ?, category = ?, unit = ?, measure_by_unit = ? WHERE id = ?",
        [product.name, product.image_url, product.category, product.unit, product.measure_by_unit, id],
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
