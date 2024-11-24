// backend/middleware/validateRequest.js
const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());  // Log validation errors
    return res.status(400).json({ errors: errors.array() });  // Send detailed error response
  }
  next();  // Proceed to the next middleware or route handler
};

module.exports = validateRequest;
