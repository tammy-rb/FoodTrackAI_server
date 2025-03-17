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

  // Get all meals
  static getAll() {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meals", (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        console.log("Meals: ", res);
        resolve(res);
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
