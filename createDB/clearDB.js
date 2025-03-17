import mysql from 'mysql2';
import con from "./connection.js"

/**
 * Clear all data from the database 
 * make the db empty withou tables and data
 */

const clearDBTables = function(){
    con.connect(function(err) {
      if (err) throw err;
      con.query("drop table if exists meal_products", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted meal_products table successfully");
      });
      con.query("drop table if exists products", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted products table successfully");
      });
      con.query("drop table if exists meals", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted meals table successfully");
      });
    });
}

export default clearDBTables;