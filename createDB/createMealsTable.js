import mysql from 'mysql2';
import con from "./connection.js";

/**
 * Create meals table, insert records
 * If success - print its records
 * The meal contains the unique names of the products.
 */

const meals = [
  { 
    "id": 1, 
    "products": "milk#potato#corn", 
    "description": "Mostly, initial weight is 1200 grams",
    "picture_before": "before1.jpg",
    "picture_after": "after1.jpg",
    "weight_before": 1200,
    "weight_after": 800
  },
  { 
    "id": 2, 
    "products": "apple#orange#banana", 
    "description": "Mostly, one fruit from any",
    "picture_before": "before2.jpg",
    "picture_after": "after2.jpg",
    "weight_before": 500,
    "weight_after": 350
  }
];

const createMealsTable = () => {
  con.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");

    // Create meals table if not exists
    const sqlCreateTable = `CREATE TABLE IF NOT EXISTS meals (
      id INT PRIMARY KEY AUTO_INCREMENT,
      products VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      picture_before VARCHAR(255),
      picture_after VARCHAR(255),
      weight_before INT,
      weight_after INT
    )`;

    con.query(sqlCreateTable, (err) => {
      if (err) throw err;
      console.log("Meals table created or already exists.");

      // Insert data into meals table
      meals.forEach(meal => {
        const sqlInsert = `INSERT INTO meals (products, description, picture_before, picture_after, weight_before, weight_after) 
                           VALUES (?, ?, ?, ?, ?, ?)`;

        con.query(sqlInsert, [
          meal.products, 
          meal.description, 
          meal.picture_before, 
          meal.picture_after, 
          meal.weight_before, 
          meal.weight_after
        ], (err, result) => {
          if (err) throw err;
          if (result.affectedRows > 0) {
            console.log(`Inserted meal: ${meal.products}`);
          }
        });
      });

      // Print table records
      con.query("SELECT * FROM meals", (err, result) => {
        if (err) throw err;
        console.log("Meals Table Data:", result);
      });
    });
  });
};

export default createMealsTable;
