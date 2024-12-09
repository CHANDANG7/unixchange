const express = require('express');
const router = express.Router();
const { validateDetails, getExchangeRate, updateBalances, logTransaction } = require('../services/transactionService');
const User = require('../models/User'); 
const Transaction = require('../models/Transaction'); // Import the Transaction model

// POST method to validate transaction details
router.post('/validate', async (req, res) => {
  const { senderUniqueId, receiverInput, password, amount } = req.body;

  try {
    const { receiverUniqueId, receiverCurrency, exchangeRate } = await validateDetails(
      senderUniqueId,
      receiverInput,
      password,
      amount
    );
    res.status(200).json({
      message: 'Validation successful',
      receiverUniqueId,
      receiverCurrency,
      exchangeRate,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST method to send money
router.post('/sendMoney', async (req, res) => {
  const { senderUniqueId, receiverInput, password, amount } = req.body;

  try {
    // Validate the transaction details
    const { receiverUniqueId, receiverCurrency, exchangeRate } = await validateDetails(
      senderUniqueId,
      receiverInput,
      password,
      amount
    );

    // Process the transaction
    const sender = await User.findOne({ uniqueId: senderUniqueId });
    const receiver = await User.findOne({ uniqueId: receiverUniqueId });

    if (!sender || !receiver) {
      throw new Error('Sender or Receiver not found');
    }

    // Ensure the sender has enough balance
    if (sender.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount * exchangeRate; // Apply exchange rate to the transfer

    // Save the updated balances
    await sender.save();
    await receiver.save();

    // Optionally, log the transaction in your database (ensure you have a Transaction model)
    const transaction = new Transaction({
      sender: sender.uniqueId,
      receiver: receiver.uniqueId,
      amount,
      senderCurrency: sender.currency,
      receiverCurrency: receiver.currency,
    });
    await transaction.save();

    // Respond with success message and transaction details
    res.status(200).json({
      message: 'Transaction successful',
      sentCurrency: sender.currency,  // Include the sent currency
      amount,                          // Include the amount
      receiverUniqueId,
      receiverCurrency,
      exchangeRate,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Route to fetch user's recent transactions
router.get('/history', async (req, res) => {
  const senderUniqueId = req.query.senderUniqueId; // Get user ID from query param

  try {
    // Fetch and populate sender and receiver data in the transaction history
    const transactions = await Transaction.find({
      $or: [{ sender: senderUniqueId }, { receiver: senderUniqueId }]
    })
      .populate('sender')  // Populate sender's data (make sure sender is a reference in the schema)
      .populate('receiver')  // Populate receiver's data (make sure receiver is a reference in the schema)
      .sort({ transactionDate: -1 })  // Sort by transaction date (latest first)
      .limit(10);  // Limit to 10 recent transactions

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions', error: err.message });
  }
});

module.exports = router;
