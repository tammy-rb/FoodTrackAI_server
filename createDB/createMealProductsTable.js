import mysql from 'mysql2';
import con from './connection.js';

/**
 * This function creates the 'meal_products' table which is used to establish 
 * a many-to-many relationship between meals and products. Each meal can consist 
 * of multiple products, and for each product in a meal, we store the weight before 
 * and after its inclusion in the meal. The table ensures that each combination 
 * of meal and product is unique.
 */
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
  });
};

export default createMealProductsTable;
