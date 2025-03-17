import { FOOD_CATEGORIES, UNITS } from "../globals.js"

const validateProduct = (req, res, next) => {
    const { name, sku, category, serving_style, unit } = req.body;
  
    // Check required fields
    if (!name || !sku) {
      return res.status(400).json({ error: "Missing required fields (name and SKU are required)" });
    }
  
    // Convert category to lowercase if it's provided
    if (category) {
      req.body.category = category.toLowerCase();
    }
  
    // Validate category
    if (category && !FOOD_CATEGORIES.includes(req.body.category)) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${FOOD_CATEGORIES.join(", ")}` });
    }
  
    // Validate unit
    if (unit && !UNITS.includes(unit)) {
      return res.status(400).json({ error: `Invalid unit. Must be one of: ${UNITS.join(", ")}` });
    }
  
    // Validate serving_style
    const validServingStyles = ["ground", "regular"];
    if (serving_style && !validServingStyles.includes(serving_style)) {
      return res.status(400).json({ error: `Invalid serving style. Must be 'ground' or 'regular'` });
    }
  
    // Convert SKU to uppercase (standard practice)
    req.body.sku = sku.trim().toUpperCase();
  
    next();
  };
  
  export default validateProduct;
  