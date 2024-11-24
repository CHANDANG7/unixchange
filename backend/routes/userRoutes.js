const express = require('express');
const { param, body, validationResult } = require('express-validator');
const User = require('../models/User');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt'); // If you're using bcrypt for password hashing
const BASE_URL = `https://v6.exchangerate-api.com/v6/788196cbe1390754c7ad0823/latest/USD`;
 

const router = express.Router();

// Middleware to validate the request body
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to fetch user by email
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  console.log("Received email:", email);  // Debugging line
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json(user); // Send the user data
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch user by uniqueId
router.get('/uniqueId/:uniqueId', async (req, res) => {
  const { uniqueId } = req.params;
  try {
    const user = await User.findOne({ uniqueId });
    if (user) {
      res.json(user); // Send the user data
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:uniqueId/deposit', async (req, res) => {
  const { uniqueId } = req.params;
  const { amount } = req.body;
  try {
    const user = await User.findOne({ uniqueId });
    if (user) {
      user.balance += amount; // Add the deposit amount to the user's balance
      await user.save();
      res.json({ updatedBalance: user.balance });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});




// Route to handle profile update
router.put('/:uniqueId/update',
  [
    param('uniqueId').isLength({ min: 6, max: 6 }).withMessage('Invalid Unique ID'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').optional().isLength({ min: 1 }).withMessage('Name cannot be empty'),
    body('currency').optional().isString().withMessage('Currency must be a string')
  ],
  validateRequest,
  async (req, res) => {
    const { uniqueId } = req.params;
    const { name, email, password, currency } = req.body;

    try {
      const user = await User.findOne({ uniqueId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      if (currency) user.currency = currency;

      await user.save();
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);
router.get('/rates', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    
    if (!response.data || !response.data.conversion_rates) {
      return res.status(500).json({ message: 'Invalid response from the exchange rate API' });
    }

    const exchangeRates = {
      INR: response.data.conversion_rates.INR,
      USD: response.data.conversion_rates.USD,
      EUR: response.data.conversion_rates.EUR,
      GBP: response.data.conversion_rates.GBP,
      JPY: response.data.conversion_rates.JPY,
      AUD: response.data.conversion_rates.AUD,
      CAD: response.data.conversion_rates.CAD,
      CNY: response.data.conversion_rates.CNY,
    };

    res.json(exchangeRates); // Send the rates to the frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching exchange rates', error: err.message });
  }
});
module.exports = router;
