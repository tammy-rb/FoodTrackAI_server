import Meal from '../DL/meal.dl.js';

/**
 * Meal service:
 * Create
 * Update by ID
 * Remove
 * Get all
 * Get by ID
 * Get by products
 */
class MealCrud {

  static async createMeal(req, res) {
    if (!req.body.products) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const meal = new Meal({
        products: req.body.products.toLowerCase(),
        description: req.body.description
      });

      const newMeal = await Meal.create(meal);
      res.status(201).json(newMeal);
    } catch (error) {
      console.error('Error creating meal:', error);
      res.status(500).json({ error: error.message });
    }
  }

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
      const products = req.query.products;
      const meals = await Meal.getAll(products);
      res.json(meals);
    } catch (error) {
      console.error('Error fetching all meals:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMeal(req, res) {
    try {
      const mealId = req.params.id;
      const updatedMeal = new Meal({
        products: req.body.products.toLowerCase(),
        description: req.body.description
      });

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