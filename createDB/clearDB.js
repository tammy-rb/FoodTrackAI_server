import mysql from 'mysql2';
import con from "./connection.js"

/**
 * Clear all data from the database 
 * make the db empty withou tables and data
 */

const clearDBTables = () => {
  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      console.log("Connected to MySQL for table deletion.");

      const tables = ["meal_products", "products", "meals"];
      const dropTablePromises = tables.map((table) => {
        return new Promise((resolve, reject) => {
          con.query(`DROP TABLE IF EXISTS ${table}`, (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            console.log(`Deleted ${table} table successfully.`);
            resolve();
          });
        });
      });

      Promise.all(dropTablePromises)
        .then(() => {
          console.log("All tables deleted successfully.");
          resolve();
        })
        .catch(reject);
    });
  });
};

export default clearDBTables;
