import mysql from 'mysql2';
import con from "./connection.js";
import { FOOD_CATEGORIES } from '../app/globals.js';

const my_image = 'uploads/products/milk.jpg';

const products = [
  { "id": 1, "name": "milk", "sku": "MLK001", "image_url": my_image, "category": FOOD_CATEGORIES[1], "dosage": 1, "unit": "cup", "weight_per_unit": 240, "calories_per_unit": 150, "serving_style": "regular" },
  { "id": 2, "name": "bread", "sku": "BRD001", "image_url": my_image, "category": FOOD_CATEGORIES[0], "dosage": 2, "unit": "slice", "weight_per_unit": 40, "calories_per_unit": 80, "serving_style": "regular" },
  { "id": 3, "name": "cheese", "sku": "CHS001", "image_url": my_image, "category": FOOD_CATEGORIES[2], "dosage": 1, "unit": "slice", "weight_per_unit": 30, "calories_per_unit": 100, "serving_style": "regular" },
  { "id": 4, "name": "butter", "sku": "BTR001", "image_url": my_image, "category": FOOD_CATEGORIES[2], "dosage": 1, "unit": "tablespoon", "weight_per_unit": 14, "calories_per_unit": 100, "serving_style": "regular" },
  { "id": 5, "name": "eggs", "sku": "EGG001", "image_url": my_image, "category": FOOD_CATEGORIES[3], "dosage": 2, "unit": "pcs", "weight_per_unit": 50, "calories_per_unit": 70, "serving_style": "regular" },
  { "id": 6, "name": "rice", "sku": "RCE001", "image_url": my_image, "category": FOOD_CATEGORIES[4], "dosage": 1, "unit": "cup", "weight_per_unit": 200, "calories_per_unit": 130, "serving_style": "regular" },
  { "id": 7, "name": "apple", "sku": "APL001", "image_url": my_image, "category": FOOD_CATEGORIES[5], "dosage": 1, "unit": "pcs", "weight_per_unit": 180, "calories_per_unit": 95, "serving_style": "regular" },
  { "id": 8, "name": "banana", "sku": "BNN001", "image_url": my_image, "category": FOOD_CATEGORIES[5], "dosage": 1, "unit": "pcs", "weight_per_unit": 120, "calories_per_unit": 105, "serving_style": "regular" },
  { "id": 9, "name": "chicken", "sku": "CHK001", "image_url": my_image, "category": FOOD_CATEGORIES[6], "dosage": 1, "unit": "kg", "weight_per_unit": 1000, "calories_per_unit": 239, "serving_style": "regular" },
  { "id": 10, "name": "fish", "sku": "FSH001", "image_url": my_image, "category": FOOD_CATEGORIES[6], "dosage": 1, "unit": "kg", "weight_per_unit": 900, "calories_per_unit": 206, "serving_style": "regular" },
  { "id": 11, "name": "carrot", "sku": "CRT001", "image_url": my_image, "category": FOOD_CATEGORIES[7], "dosage": 1, "unit": "pcs", "weight_per_unit": 61, "calories_per_unit": 25, "serving_style": "regular" },
  { "id": 12, "name": "potato", "sku": "POT001", "image_url": my_image, "category": FOOD_CATEGORIES[7], "dosage": 1, "unit": "pcs", "weight_per_unit": 150, "calories_per_unit": 110, "serving_style": "regular" },
  { "id": 13, "name": "yogurt", "sku": "YGT001", "image_url": my_image, "category": FOOD_CATEGORIES[1], "dosage": 1, "unit": "cup", "weight_per_unit": 245, "calories_per_unit": 150, "serving_style": "regular" },
  { "id": 14, "name": "almonds", "sku": "ALM001", "image_url": my_image, "category": FOOD_CATEGORIES[8], "dosage": 28, "unit": "g", "weight_per_unit": 28, "calories_per_unit": 160, "serving_style": "regular" },
  { "id": 15, "name": "tomato", "sku": "TMT001", "image_url": my_image, "category": FOOD_CATEGORIES[7], "dosage": 1, "unit": "pcs", "weight_per_unit": 123, "calories_per_unit": 22, "serving_style": "regular" }
];

const createProductsTable = function() {
  con.connect(function(err) {
    if (err) throw err;

    var sql = `CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,  -- Unique identifier for each product
      sku VARCHAR(20) NOT NULL UNIQUE,    -- Unique stock-keeping unit (SKU)
      name VARCHAR(255) NOT NULL,         -- Product name
      image_url VARCHAR(255),             -- Path to product image
      category VARCHAR(255),               -- Category (e.g., dairy, fruits, etc.)
      dosage INT,                         -- Quantity per serving (e.g., 2 slices, 1 cup)
      unit VARCHAR(50),                   -- Unit of measure (e.g., cup, slice, kg)
      weight_per_unit INT,                 -- Weight of a single unit in grams
      calories_per_unit INT,               -- Caloric value per unit
      serving_style ENUM('ground', 'regular')  -- Serving style (ground or regular)
    )`;

    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Products table created or already exists.");
    });

    products.forEach(product => {
      var sql = `INSERT INTO products (id, sku, name, image_url, category, dosage, unit, weight_per_unit, calories_per_unit, serving_style) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      con.query(sql, [
        product.id,
        product.sku,
        product.name,
        product.image_url,
        product.category,
        product.dosage,
        product.unit,
        product.weight_per_unit,
        product.calories_per_unit,
        product.serving_style
      ], function(err, result) {
        if (err) throw err;
        if (result.affectedRows > 0) {
          console.log(`Inserted product: ${product.name} (SKU: ${product.sku})`);
        }
      });
    });

    con.query("SELECT * FROM products", function(err, result) {
      if (err) throw err;
      console.log("Products Table Data:", result);
    });
  });
};

export default createProductsTable;
