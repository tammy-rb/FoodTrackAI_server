import mysql from 'mysql2';
import con from './connection.js';

/**
 * This function creates the 'meal_products' table which is used to establish 
 * a many-to-many relationship between meals and products. Each meal can consist 
 * of multiple products, and for each product in a meal, we store the weight before 
 * and after its inclusion in the meal. The table ensures that each combination 
 * of meal and product is unique.
 */

// Meal-Product combinations (example data linking meals and products)
const mealProducts = [
  { meal_id: 1, product_id: 1, weight_before: 500, weight_after: 450 }, 
  { meal_id: 1, product_id: 2, weight_before: 200, weight_after: 300 },
  { meal_id: 1, product_id: 3, weight_before: 870, weight_after: 450 },
  { meal_id: 1, product_id: 4, weight_before: 800, weight_after: 150 },
  { meal_id: 2, product_id: 2, weight_before: 40, weight_after: 30 }, 
  { meal_id: 3, product_id: 3, weight_before: 30, weight_after: 28 },  
  { meal_id: 4, product_id: 10, weight_before: 100, weight_after: 95 }, 
  { meal_id: 5, product_id: 5, weight_before: 100, weight_after: 90 },
  { meal_id: 6, product_id: 6, weight_before: 200, weight_after: 180 },
  { meal_id: 7, product_id: 8, weight_before: 120, weight_after: 110 },
  { meal_id: 8, product_id: 9, weight_before: 1000, weight_after: 950 },
  { meal_id: 9, product_id: 11, weight_before: 61, weight_after: 58 },
  { meal_id: 10, product_id: 12, weight_before: 150, weight_after: 140 }
];

const createMealProductsTable = () => {
  con.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");

    // Create meal_products table if it doesn't exist
    const sqlCreateTable = `CREATE TABLE IF NOT EXISTS meal_products (
      meal_id INT,
      product_id INT,
      weight_before INT,
      weight_after INT,
      PRIMARY KEY (meal_id, product_id),
      FOREIGN KEY (meal_id) REFERENCES meals(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`;

    con.query(sqlCreateTable, (err) => {
      if (err) throw err;
      console.log("meal_products table created or already exists.");
    });

    // Insert meal product data
    mealProducts.forEach(mealProduct => {
      const sqlInsert = `INSERT INTO meal_products (meal_id, product_id, weight_before, weight_after) 
                         VALUES (?, ?, ?, ?)`;

      con.query(sqlInsert, [
        mealProduct.meal_id,
        mealProduct.product_id,
        mealProduct.weight_before,
        mealProduct.weight_after
      ], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          console.log(`Inserted meal product combination: Meal ${mealProduct.meal_id} with Product ${mealProduct.product_id}`);
        }
      });
    });

    // Print meal_products table records
    con.query("SELECT * FROM meal_products", (err, result) => {
      if (err) throw err;
      console.log("meal_products Table Data:", result);
    });
  });
};

export default createMealProductsTable;
