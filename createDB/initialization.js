import mysql from 'mysql2';
import con from "./connection.js"
import createProductsTable from './createProductsTable.js';
import createMealsTable from './createMealsTable.js';
import clearDBTables from './clearDB.js';


/**
 * init the DB. assume the DB alreay exist. 
 * Clear all data from the database and reset it to its initial state
 */
const initialization = async function(result) {

  try {
    await clearDBTables();
    await createProductsTable();
    await createMealsTable();
    console.log("Database and tables created successfully.")
    result(null, "Database and tables created successfully");
  } catch (error) {
    console.error('Initialization error:', error);
    result(error, null);
  }
}

export default initialization;