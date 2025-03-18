import express from 'express';
import MealProductCrud from '../BL/meal_products.BL.js'

const router = express.Router();

// Create a new meal_product
router.post('/', MealProductCrud.createMealProduct);

// Get a specific meal_product by meal_id and product_id
router.get('/:meal_id/:product_id', MealProductCrud.getMealProductById);

// Get all products by meal_id
router.get('/meal/:meal_id/products', MealProductCrud.getAllProductsByMeal);

// Get all meal_products by product_id
router.get('/product/:product_id/meals', MealProductCrud.getAllMealProductsByProduct);

// Update a meal_product by meal_id and product_id
router.put('/:meal_id/:product_id', MealProductCrud.updateMealProduct);

// Remove a specific meal_product by meal_id and product_id
router.delete('/meal-product/:meal_id/:product_id', MealProductCrud.removeMealProduct);

// Remove all meal_products by meal_id
router.delete('/meal/:meal_id', MealProductCrud.removeAllMealProductsByMeal);

// Remove all meal_products by product_id
router.delete('/product/:product_id', MealProductCrud.removeAllMealProductsByProduct);

export default router;
