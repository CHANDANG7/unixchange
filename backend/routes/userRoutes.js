const express = require('express');
const { param, body, validationResult } = require('express-validator');
const User = require('../models/User');
const cors = require('cors');
const axios = require('axios');
const { exec } = require('child_process');
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
      // Ensure amount is treated as a fixed-point number with no decimals
      const fixedAmount = Number(amount).toFixed(3);  // Round to 2 decimal places if needed

      // If you don't want any decimal point, just add the fixed integer:
      const exactAmount = parseFloat(fixedAmount);  // Parse back into float to avoid strings

      user.balance += exactAmount; // Add the exact amount to the user's balance
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
    param('uniqueId').isLength({ min: 6}).withMessage('Invalid Unique ID'),
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

      // Only update the fields that have new values provided
      let isUpdated = false;

      // Check and update name
      if (name && name !== user.name) {
        user.name = name;
        isUpdated = true;
      }

      // Check and update email
      if (email && email !== user.email) {
        user.email = email;
        isUpdated = true;
      }

      // Check and update password (compare plain password with hashed password)
      if (password && password !== user.password) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          isUpdated = true;
        }
      }

      // Check and update currency
      if (currency && currency !== user.currency) {
        user.currency = currency;
        isUpdated = true;
      }

      // If no updates were made, return a message indicating no changes
      if (!isUpdated) {
        return res.status(400).json({ message: 'No changes to update' });
      }

      // Save the updated user
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
router.post('/predict', (req, res) => {
  const { base_currency, currency, day, month, year } = req.body;

  // Validate that required parameters are provided
  if (!base_currency || !currency || !day || !month || !year) {
      return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Call the Python script for prediction using the passed parameters
  exec(
    `python "C:/CODING/Minor Project/unixchange/ML/predict.py" ${base_currency} ${currency} ${day} ${month} ${year}`,
    (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error with prediction');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error with prediction');
        }

        // Log the standard output for debugging
        console.log(`stdout: ${stdout}`);

        // Parse and send the result back to the frontend
        const result = stdout.trim(); // remove any unwanted newlines or spaces
        res.json({ exchange_rate: result });
    }
);

});

module.exports = router;
