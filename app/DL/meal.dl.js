import sql from './connection.js';

class Meal {
  constructor(meal) {
    if (meal) {
      this.products = meal.products;
      this.description = meal.description;
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

  // Find a meal by name
  static findByProducts(products) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meals WHERE products = ?", products, (err, res) => {
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

 /**
  * Get all meals (optionally filter by products)
  * @param {String} products : a product list with , as separator
  * like product1,product2,.. get all meals have these products
  * @returns all or filterd products
  */
static getAll(products) {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM meals";
    //filter only meals have the products specified (may have else in addition)
    if (products) {
      const productList = products.split(","); // Split input into individual products
      const conditions = productList.map(product => `products LIKE '%${product}%'`).join(" AND "); // Create SQL conditions

      query += ` WHERE ${conditions}`;
    }

    sql.query(query, (err, res) => {
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
        "UPDATE meals SET products = ?, description = ? WHERE id = ?",
        [meal.products, meal.description, id],
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
