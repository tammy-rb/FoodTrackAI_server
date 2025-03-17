import mysql from 'mysql2';
import con from "./connection.js";

/**
 * Create meals table, insert records
 * If success - print its records
 */

const image_before = 'uploads/meals/meal_before.jpg';
const image_after = 'uploads/meals/meal_after.jpg';

const meals = [
  { 
    "id": 1, 
    "description": "Mostly, initial weight is 1200 grams",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 1200,
    "weight_after": 800
  },
  { 
    "id": 2, 
    "description": "Cheese sandwich with buttered bread",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 500,
    "weight_after": 300
  },
  { 
    "id": 3, 
    "description": "A classic chicken and rice dish with carrots",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 1000,
    "weight_after": 700
  },
  { 
    "id": 4, 
    "description": "Grilled fish served with rice and apple slices",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 900,
    "weight_after": 600
  },
  { 
    "id": 5, 
    "description": "Banana milkshake with eggs for protein",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 750,
    "weight_after": 500
  },
  { 
    "id": 6, 
    "description": "A buttery corn and carrot mix",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 600,
    "weight_after": 400
  },
  { 
    "id": 7, 
    "description": "Scrambled eggs with cheese on bread",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 700,
    "weight_after": 450
  },
  { 
    "id": 8, 
    "description": "Baked potato with grilled chicken and butter",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 1100,
    "weight_after": 750
  },
  { 
    "id": 9, 
    "description": "A simple fruit and milk meal",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 650,
    "weight_after": 450
  },
  { 
    "id": 10, 
    "description": "Grilled fish with carrot slices on bread",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 850,
    "weight_after": 550
  },
  { 
    "id": 11, 
    "description": "A simple rice meal with corn and chicken",
    "picture_before": image_before,
    "picture_after": image_after,
    "weight_before": 950,
    "weight_after": 700
  }
];

const createMealsTable = () => {
  con.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");

    // Create meals table if not exists 
    const sqlCreateTable = `CREATE TABLE IF NOT EXISTS meals (
      id INT PRIMARY KEY AUTO_INCREMENT,
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
        const sqlInsert = `INSERT INTO meals (description, picture_before, picture_after, weight_before, weight_after) 
                           VALUES (?, ?, ?, ?, ?)`;

        con.query(sqlInsert, [
          meal.description, 
          meal.picture_before, 
          meal.picture_after, 
          meal.weight_before, 
          meal.weight_after
        ], (err, result) => {
          if (err) throw err;
          if (result.affectedRows > 0) {
            console.log(`Inserted meal: ${meal.description}`);
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
