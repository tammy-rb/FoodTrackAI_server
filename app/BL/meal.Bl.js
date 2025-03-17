import Meal from '../DL/meal.dl.js';
import FileHandler from '../utils/fileHandler.js';

/**
 * Meal service:
 * Create
 * Update by ID
 * Remove
 * Get all
 * Get by ID
 */

const path_to_files = 'uploads/meals/';

class MealCrud {

  //create new meal. notice 2 images are saved as "before__timestamp", "after_timestamp". 
  static async createMeal(req, res) {
    try {
      // Ensure required fields are provided
      if (!req.body.weight_before || !req.body.weight_after) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { description = null, weight_before, weight_after } = req.body;
      const pictures = req.files ?? [];

      // Check if two images (before and after) are provided
      if (pictures.length < 2) {
        return res.status(400).json({ error: 'Missing required fields: image_before, image_after' });
      }

      // Extract file paths
      const picture_before =  path_to_files + pictures[0]?.filename || null;
      const picture_after = path_to_files + pictures[1]?.filename || null;

      // Create new meal object
      const meal = new Meal({
        description,
        weight_before,
        weight_after,
        picture_before,
        picture_after
      });

      // Save the new meal in the database
      const newMeal = await Meal.create(meal);
      res.status(201).json(newMeal);
    } catch (error) {
      res.status(500).json({ error: 'Error creating meal', details: error.message });
    }
  };

  static async getMealById(req, res) {
    try {
      const mealId = req.params.id;
      const meal = await Meal.findById(mealId);
      res.json(meal);
    } catch (error) {
      if (error.kind === 'not_found') {
        return res.status(404).json({ error: 'Meal not found' });
      }
      console.error(`Error fetching meal by ID (${req.params.id}):`, error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllMeals(req, res) {
    try {
      const meals = await Meal.getAll();
      res.json(meals);
    } catch (error) {
      console.error('Error fetching all meals:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMeal(req, res) {
    try {
      const mealId = req.params.id;

      // Retrieve existing meal
      const existingMeal = await Meal.findById(mealId);

      // Prepare the updated fields
      const updatedMeal = {
        description: req.body.description || null,
        weight_before: req.body.weight_before || null,
        weight_after: req.body.weight_after || null
      };

      if (!updatedMeal.weight_after || !updatedMeal.weight_before) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Handle new images (before and after)
      const pictures = req.files || [];
      // Check if two images (before and after) are provided
      if (pictures.length < 2) {
        return res.status(400).json({ error: 'Missing required fields: image before, image after' });
      }

      // Delete files if it exists
      if (existingMeal.picture_before) {
        await FileHandler.deleteFile(existingMeal.picture_before);
      }
      if (existingMeal.picture_after) {
        await FileHandler.deleteFile(existingMeal.picture_after);
      }

      // Update the meal with new image 
      updatedMeal.picture_before = path_to_files + pictures[0]?.filename || null;
      updatedMeal.picture_after =  path_to_files + pictures[1]?.filename || null;

      // Update the meal in the database
      const updated = await Meal.update(mealId, updatedMeal);
      res.json(updated);
    } catch (error) {
      console.error('Error updating meal:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async removeMeal(req, res) {
    try {
      const mealId = req.params.id;
      const existingMeal = await Meal.findById(mealId);

      // Delete files if it exists
      if (existingMeal.picture_before) {
        await FileHandler.deleteFile(existingMeal.picture_before);
      }
      if (existingMeal.picture_after) {
        await FileHandler.deleteFile(existingMeal.picture_after);
      }
      await Meal.remove(mealId);
      res.json({ message: 'Meal deleted successfully' });

    } catch (error) {
      if (error.kind === 'not_found') {
        return res.status(404).json({ error: 'Meal not found' });
      }
      console.error('Error deleting meal:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default MealCrud;
