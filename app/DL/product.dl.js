
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

  // Modify getAll method to return a Promise
  static getAll(category) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM products";
      if (category) {
        query += ` WHERE category = '${category}'`;
      }
      sql.query(query, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        console.log("Products: ", res);
        resolve(res);
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
