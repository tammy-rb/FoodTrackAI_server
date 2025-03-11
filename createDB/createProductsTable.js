import mysql from 'mysql2';
import con from "./connection.js";
import { FOOD_CATEGORIES } from '../app/globals.js';

/**
 * create products table, insert records
 * if success - print its records
*/

const products = [
  { "id": 1, "name": "milk", "image_url": "..url", "category": FOOD_CATEGORIES[1], "unit": "kg", "measure_by_unit": 300 },
  // Add other products here as needed
];

const createProductsTable = function() {
  con.connect(function(err) {
    if (err) throw err;

    // Create the products table
    var sql = `CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      image_url VARCHAR(255),
      category VARCHAR(255),
      unit VARCHAR(50),
      measure_by_unit INT
    )`;
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Products table created or already exists.");
    });

    // Insert data into products table
    products.forEach(product => {
      var sql = `INSERT INTO products (id, name, image_url, category, unit, measure_by_unit) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
      con.query(sql, [
        product.id,
        product.name,
        product.image_url,
        product.category,
        product.unit,
        product.measure_by_unit
      ], function(err, result) {
        if (err) throw err;
        console.log(`Product inserted with id: ${result.insertId}`);
      });
    });

    // Print the table to verify the records
    con.query("SELECT * FROM products", function(err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
};

export default createProductsTable;
