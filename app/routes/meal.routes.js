import express from 'express';
import MealCrud from '../BL/meal.Bl.js';

const router = express.Router();

// Create a meal
router.post('/', MealCrud.createMeal);

// Get a meal by ID
router.get('/:id', MealCrud.getMealById);

// Get all meals (or filter by products using the params)
router.get('/', MealCrud.getAllMeals);

// Update a meal by ID
router.put('/:id', MealCrud.updateMeal);

// Delete a meal by ID
router.delete('/:id', MealCrud.removeMeal);

export default router;
