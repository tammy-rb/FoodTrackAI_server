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

  static create(newMealProduct) {
    return new Promise((resolve, reject) => {
      sql.query("INSERT INTO meal_products SET ?", newMealProduct, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        console.log("Created meal_product: ", { id: res.insertId, ...newMealProduct });
        resolve({ id: res.insertId, ...newMealProduct });
      });
    });
  }

  static get(meal_id, product_id) {
    return new Promise((resolve, reject) => {
      sql.query(
        "SELECT * FROM meal_products WHERE meal_id = ? AND product_id = ?",
        [meal_id, product_id],
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            reject(err);
            return;
          }
          if (res.length) {
            console.log("Found meal_products for meal_id: ", meal_id, " and product_id: ", product_id, res);
            resolve(res);
          } else {
            reject({ kind: "not_found" });
          }
        }
      );
    });
  }

  static findByMealId(meal_id) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meal_products WHERE meal_id = ?", meal_id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        if (res.length) {
          console.log("Found meal_products for meal_id: ", res);
          resolve(res);
        } else {
          reject({ kind: "not_found" });
        }
      });
    });
  }

  static findByProductId(product_id) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meal_products WHERE product_id = ?", product_id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        if (res.length) {
          console.log("Found meal_products for product_id: ", res);
          resolve(res);
        } else {
          reject({ kind: "not_found" });
        }
      });
    });
  }

  static getAllByMeal(meal_id) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meal_products WHERE meal_id = ?", meal_id, (err, mealProducts) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        resolve(mealProducts);
      });
    });
  }

  static getAllByProduct(product_id) {
    return new Promise((resolve, reject) => {
      sql.query("SELECT * FROM meal_products WHERE product_id = ?", product_id, (err, mealProducts) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        resolve(mealProducts);
      });
    });
  }

  static update(meal_id, product_id, mealProduct) {
    return new Promise((resolve, reject) => {
      sql.query(
        `UPDATE meal_products 
         SET weight_before = ?, weight_after = ? 
         WHERE meal_id = ? AND product_id = ?`,
        [mealProduct.weight_before, mealProduct.weight_after, meal_id, product_id],
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
          console.log("Updated meal_product: ", { meal_id, product_id, ...mealProduct });
          resolve({ meal_id, product_id, ...mealProduct });
        }
      );
    });
  }

  static remove(meal_id, product_id) {
    return new Promise((resolve, reject) => {
      sql.query("DELETE FROM meal_products WHERE meal_id = ? AND product_id = ?", [meal_id, product_id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          reject({ kind: "not_found" });
          return;
        }
        console.log("Deleted meal_product with meal_id: ", meal_id, " and product_id: ", product_id);
        resolve(true);
      });
    });
  }

  static removeAllByMeal(meal_id) {
    return new Promise((resolve, reject) => {
      sql.query("DELETE FROM meal_products WHERE meal_id = ?", meal_id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        console.log("Deleted all meal_products for meal_id: ", meal_id);
        resolve(true);
      });
    });
  }

  static removeAllByProduct(product_id) {
    return new Promise((resolve, reject) => {
      sql.query("DELETE FROM meal_products WHERE product_id = ?", product_id, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }
        console.log("Deleted all meal_products for product_id: ", product_id);
        resolve(true);
      });
    });
  }
}

export default MealProduct;
