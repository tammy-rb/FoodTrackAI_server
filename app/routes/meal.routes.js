import express from 'express';
import MealCrud from '../BL/meal.Bl.js';
import FileUpload from '../middlewar/multerConfig.js';

const router = express.Router();

// Middleware for handling two image uploads
const uploadImages = FileUpload('uploads/meals', ['image/jpeg', 'image/png'], 'meal_pictures', 2, 5);

// Create a meal with image uploads
router.post('/', uploadImages, MealCrud.createMeal);

// Get a meal by ID
router.get('/:id', MealCrud.getMealById);

// Get all meals (or filter by products using the params)
router.get('/', MealCrud.getAllMeals);

// Update a meal by ID with image uploads
router.put('/:id', uploadImages, MealCrud.updateMeal);

// Delete a meal by ID
router.delete('/:id', MealCrud.removeMeal);

router.get('/products/:id', MealCrud.getMealProducts)

export default router;
