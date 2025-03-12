
import sql from './connection.js';

/***
 * handling sql products table
 * product crud:
 * create
 * getById
 * getByName
 * getAll (can filter by category)
 * remove
 * update
 */

//Product object
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
}

Product.create = (newProduct, result) => {
  sql.query("INSERT INTO products SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Created product: ", { id: res.insertId, ...newProduct });
    result(null, { id: res.insertId, ...newProduct });
  });
};


Product.findById = (id, result) => {
  sql.query("SELECT * FROM products WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("Found product: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Product.findByName = (name, result) => {
  sql.query("SELECT * FROM products WHERE name = ?", name, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("Found product: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

/**
 * get all products. 
 * or get all products in specific category
 */
Product.getAll = (category, result) => {
  let query = "SELECT * FROM products";
  if (category) {
    query += ` WHERE category = '${category}'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Products: ", res);
    result(null, res);
  });
};

Product.update = (id, product, result) => {
  sql.query(
    "UPDATE products SET name = ?, image_url = ?, category = ?, unit = ?, measure_by_unit = ? WHERE id = ?",
    [product.name, product.image_url, product.category, product.unit, product.measure_by_unit, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Updated product: ", { id, ...product });
      result(null, { id, ...product });
    }
  );
};

Product.remove = (id, result) => {
  sql.query("DELETE FROM products WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Deleted product with id: ", id);
    result(null, true);
  });
};

export default Product;