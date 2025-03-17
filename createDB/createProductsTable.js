import mysql from 'mysql2';
import con from "./connection.js";
import { FOOD_CATEGORIES } from '../app/globals.js';

/**
 * create products table, insert records
 * if success - print its records
*/

const my_image = 'public/uploads/products/milk.jpg'

const products = [
  { "id": 1, "name": "milk", "image_url": my_image, "category": FOOD_CATEGORIES[1], "unit": "kg", "measure_by_unit": 300 },
  { "id": 2, "name": "bread", "image_url": my_image, "category": FOOD_CATEGORIES[0], "unit": "pcs", "measure_by_unit": 500 },
  { "id": 3, "name": "cheese", "image_url": my_image, "category": FOOD_CATEGORIES[2], "unit": "kg", "measure_by_unit": 250 },
  { "id": 4, "name": "butter", "image_url": my_image, "category": FOOD_CATEGORIES[2], "unit": "g", "measure_by_unit": 200 },
  { "id": 5, "name": "eggs", "image_url": my_image, "category": FOOD_CATEGORIES[3], "unit": "pcs", "measure_by_unit": 12 },
  { "id": 6, "name": "rice", "image_url": my_image, "category": FOOD_CATEGORIES[4], "unit": "kg", "measure_by_unit": 1000 },
  { "id": 7, "name": "apple", "image_url": my_image, "category": FOOD_CATEGORIES[5], "unit": "kg", "measure_by_unit": 150 },
  { "id": 8, "name": "banana", "image_url": my_image, "category": FOOD_CATEGORIES[5], "unit": "kg", "measure_by_unit": 120 },
  { "id": 9, "name": "chicken", "image_url": my_image, "category": FOOD_CATEGORIES[6], "unit": "kg", "measure_by_unit": 800 },
  { "id": 10, "name": "fish", "image_url": my_image, "category": FOOD_CATEGORIES[6], "unit": "kg", "measure_by_unit": 900 },
  { "id": 11, "name": "carrot", "image_url": my_image, "category": FOOD_CATEGORIES[7], "unit": "kg", "measure_by_unit": 500 }
];

const createProductsTable = function() {
  con.connect(function(err) {
    if (err) throw err;

    // Create the products table
    var sql = `CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) UNIQUE NOT NULL,
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
        if (result.affectedRows > 0) {
          console.log(`Inserted product: ${product.name}`);
        }
      });
    });

    // Print the table to verify the records
    con.query("SELECT * FROM products", function(err, result) {
      if (err) throw err;
      console.log("Products Table Data:", result);

    });
  });
};

export default createProductsTable;
