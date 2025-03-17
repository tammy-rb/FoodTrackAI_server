import sql from './connection.js';

class MealProduct {
  constructor(mealProduct) {
    if (mealProduct) {
      this.meal_id = mealProduct.meal_id;
      this.product_id = mealProduct.product_id;
      this.weight_before = mealProduct.weight_before;
      this.weight_after = mealProduct.weight_after;
    }
  }

  // Create a new meal-product association
  static create(newMealProduct) {
    return new Promise((resolve, reject) => {
      sql.query("INSERT INTO meal_products SET ?", newMealProduct, (err, res) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
          return;
        }
        console.log("Created meal-product association: ", { id: res.insertId, ...newMealProduct });
        resolve({ id: res.insertId, ...newMealProduct });
      });
    });
  }

  // Get all meal-product associations
  static getAll() {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meal_products", (err, res) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
          return;
        }
        console.log("Meal-Products: ", res);
        resolve(res);
      });
    });
  }

  // Get all meal-products for a specific meal
  static getByMealId(meal_id) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meal_products WHERE meal_id = ?", meal_id, (err, res) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
          return;
        }
        console.log("Meal-Products for meal ID " + meal_id + ": ", res);
        resolve(res);
      });
    });
  }

  // Get all meal-products for a specific product
  static getByProductId(product_id) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meal_products WHERE product_id = ?", product_id, (err, res) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
          return;
        }
        console.log("Meal-Products for product ID " + product_id + ": ", res);
        resolve(res);
      });
    });
  }

  // Remove all meal-products associated with a specific meal
  static removeByMealId(meal_id) {
    return new Promise((resolve, reject) => {
      sql.query("DELETE FROM meal_products WHERE meal_id = ?", meal_id, (err, res) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
          return;
        }
        console.log("Deleted meal-products for meal ID: ", meal_id);
        resolve(true);
      });
    });
  }

  // Remove all meal-products associated with a specific product
  static removeByProductId(product_id) {
    return new Promise((resolve, reject) => {
      sql.query("DELETE FROM meal_products WHERE product_id = ?", product_id, (err, res) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
          return;
        }
        console.log("Deleted meal-products for product ID: ", product_id);
        resolve(true);
      });
    });
  }

  // Remove a specific meal-product association
  static remove(meal_id, product_id) {
    return new Promise((resolve, reject) => {
      sql.query("DELETE FROM meal_products WHERE meal_id = ? AND product_id = ?", [meal_id, product_id], (err, res) => {
        if (err) {
          console.log("Error: ", err);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          reject({ kind: "not_found" });
          return;
        }
        console.log("Deleted meal-product with meal_id: " + meal_id + " and product_id: " + product_id);
        resolve(true);
      });
    });
  }

  // Update the weight before and after for a specific meal-product association
  static update(meal_id, product_id, updatedData) {
    return new Promise((resolve, reject) => {
      sql.query(
        "UPDATE meal_products SET weight_before = ?, weight_after = ? WHERE meal_id = ? AND product_id = ?",
        [updatedData.weight_before, updatedData.weight_after, meal_id, product_id],
        (err, res) => {
          if (err) {
            console.log("Error: ", err);
            reject(err);
            return;
          }
          if (res.affectedRows == 0) {
            reject({ kind: "not_found" });
            return;
          }
          console.log("Updated meal-product: ", { meal_id, product_id, ...updatedData });
          resolve({ meal_id, product_id, ...updatedData });
        }
      );
    });
  }
}

export default MealProduct;
