import MealProduct from '../DL/meal_products.dl.js'
import Meal from '../DL/meal.dl.js'
import Product from '../DL/product.dl.js'

/**
 * MealProduct service:
 * Create
 * Update by ID
 * Remove
 * Get all
 * Get by ID
 */

class MealProductCrud {

  // Create a new meal_product
  static async createMealProduct(req, res) {
    try {
      // Ensure required fields are provided
      if (!req.body.meal_id || !req.body.product_id || !req.body.weight_before || !req.body.weight_after) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { meal_id, product_id, weight_before, weight_after } = req.body;

      // Create new meal_product object
      const mealProduct = new MealProduct({
        meal_id,
        product_id,
        weight_before,
        weight_after,
      });

      // Save the new meal_product in the database
      const newMealProduct = await MealProduct.create(mealProduct);
      res.status(201).json(newMealProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error creating meal_product', details: error.message });
    }
  }

  // Get meal_product by meal_id and product_id
  static async getMealProductById(req, res) {
    try {
      const { meal_id, product_id } = req.params;
      const mealProduct = await MealProduct.get(meal_id, product_id);
      res.json(mealProduct);
    } catch (error) {
      if (error.kind === 'not_found') {
        return res.status(404).json({ error: 'MealProduct not found' });
      }
      console.error(`Error fetching meal_product by ID (${meal_id}, ${product_id}):`, error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get all products contained in a specific meal
    static async getAllProductsByMeal(req, res) {
        try {
        const meal_id = req.params.meal_id;
        
        // Fetch all products without pagination 
        const products = await Product.getAll(null, 1, Infinity);
        
        // get all the meal products related to the meal_id as meal_products objects
        const mealProducts = await MealProduct.getAllByMeal(meal_id);
    
        // Filter the products to only include those that match the meal products
        const filteredProducts = products.products.filter(product =>
            mealProducts.some(mealProduct => mealProduct.product_id === product.id)
        );
    
        res.json(filteredProducts);
        } catch (error) {
        console.error('Error fetching all meal_products by meal_id:', error);
        res.status(500).json({ error: error.message });
        }
    }
  

    // Get all meal_products by product_id
    static async getAllMealProductsByProduct(req, res) {
        try {
        const product_id = req.params.product_id;
        
        // Fetch all mealProducts associated with the given product_id
        const mealProducts = await MealProduct.getAllByProduct(product_id);
    
        // Retrieve all meals
        const meals = await Meal.getAll();
    
        // Filter the meals that are associated with the mealProducts
        const associatedMeals = meals.filter(meal =>
            mealProducts.some(mealProduct => mealProduct.meal_id === meal.id)
        );
    
        // Return the associated meals
        res.json(associatedMeals);
        } catch (error) {
        console.error('Error fetching all meal_products by product_id:', error);
        res.status(500).json({ error: error.message });
        }
    }  

  // Update meal_product by meal_id and product_id
  static async updateMealProduct(req, res) {
    try {
      const { meal_id, product_id } = req.params;

      // Retrieve existing meal_product
      const existingMealProduct = await MealProduct.get(meal_id, product_id);

      // Prepare the updated fields
      const updatedMealProduct = {
        weight_before: req.body.weight_before || existingMealProduct.weight_before,
        weight_after: req.body.weight_after || existingMealProduct.weight_after,
      };

      if (!updatedMealProduct.weight_after || !updatedMealProduct.weight_before) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Update the meal_product in the database
      const updated = await MealProduct.update(meal_id, product_id, updatedMealProduct);
      res.json(updated);
    } catch (error) {
      console.error('Error updating meal_product:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Remove meal_product by meal_id and product_id
  static async removeMealProduct(req, res) {
    try {
      const { meal_id, product_id } = req.params;

      // Remove the meal_product from the database
      await MealProduct.remove(meal_id, product_id);
      res.json({ message: 'MealProduct deleted successfully' });
    } catch (error) {
      if (error.kind === 'not_found') {
        return res.status(404).json({ error: 'MealProduct not found' });
      }
      console.error('Error deleting meal_product:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Remove all meal_products by meal_id
  static async removeAllMealProductsByMeal(req, res) {
    try {
      const { meal_id } = req.params;

      // Remove all meal_products by meal_id
      await MealProduct.removeAllByMeal(meal_id);
      res.json({ message: 'All meal_products deleted successfully for meal_id: ' + meal_id });
    } catch (error) {
      console.error('Error deleting all meal_products by meal_id:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Remove all meal_products by product_id
  static async removeAllMealProductsByProduct(req, res) {
    try {
      const { product_id } = req.params;

      // Remove all meal_products by product_id
      await MealProduct.removeAllByProduct(product_id);
      res.json({ message: 'All meal_products deleted successfully for product_id: ' + product_id });
    } catch (error) {
      console.error('Error deleting all meal_products by product_id:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default MealProductCrud;
