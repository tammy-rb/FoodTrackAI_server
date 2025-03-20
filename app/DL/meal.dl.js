import sql from './connection.js';

class Meal {
  constructor(meal) {
    if (meal) {
      this.description = meal.description;
      this.picture_before = meal.picture_before;
      this.picture_after = meal.picture_after;
      this.weight_before = meal.weight_before;
      this.weight_after = meal.weight_after;
    }
  }

  // Create a new meal
  static create(newMeal) {
    return new Promise((resolve, reject) => {
      sql.query("INSERT INTO meals SET ?", newMeal, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        console.log("Created meal: ", { id: res.insertId, ...newMeal });
        resolve({ id: res.insertId, ...newMeal });
      });
    });
  }

  // Find a meal by ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meals WHERE id = ?", id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        if (res.length) {
          console.log("Found meal: ", res[0]);
          resolve(res[0]);
        } else {
          reject({ kind: "not_found" });
        }
      });
    });
  }

  // Get all meals with pagination
  static getAll(page = 1, limit = 10) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM meals";
      
      if (limit != Infinity) {
        const offset = (page - 1) * limit;
        query += ` LIMIT ${limit} OFFSET ${offset}`;
      }

      sql.query(query, (err, meals) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }

        // Get the total count of meals for pagination
        const countQuery = "SELECT COUNT(*) AS total FROM meals";
        sql.query(countQuery, (err, countResult) => {
          if (err) {
            console.log("error: ", err);
            reject(err);
            return;
          }

          const total = countResult[0].total;
          const totalPages = Math.ceil(total / limit);

          resolve({
            meals,
            page,
            totalPages,
            total
          });
        });
      });
    });
  }


  // Update a meal
  static update(id, meal) {
    return new Promise((resolve, reject) => {
      sql.query(
        "UPDATE meals SET description = ?, picture_before = ?, picture_after = ?, weight_before = ?, weight_after = ? WHERE id = ?",
        [meal.description, meal.picture_before, meal.picture_after, meal.weight_before, meal.weight_after, id],
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
          console.log("Updated meal: ", { id, ...meal });
          resolve({ id, ...meal });
        }
      );
    });
  }

  // Remove a meal
  static remove(id) {
    return new Promise((resolve, reject) => {
      sql.query("DELETE FROM meals WHERE id = ?", id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          reject({ kind: "not_found" });
          return;
        }
        console.log("Deleted meal with id: ", id);
        resolve(true);
      });
    });
  }
}

export default Meal;
