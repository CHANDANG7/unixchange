const express = require('express');
const router = express.Router();
const { validateDetails } = require('../services/transactionService');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

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

    // Calculate the sender and receiver amounts
    const senderAmount = amount.toFixed(3);;
    const receiverAmount = (amount * exchangeRate).toFixed(3); // Apply exchange rate to the transfer

    // Check if the receiver amount is valid
    if (receiverAmount <= 0) {
      throw new Error('Invalid transaction amount after conversion');
    }

    // Update balances
    sender.balance -= parseFloat(senderAmount);
    receiver.balance += parseFloat(receiverAmount);

    // Save the updated balances
    await sender.save();
    await receiver.save();

    // Log the transaction in your database
    const transaction = new Transaction({
      sender: sender.uniqueId,
      receiver: receiver.uniqueId,
      senderAmount,         // Sender's amount
      receiverAmount,       // Receiver's amount after exchange rate
      senderCurrency: sender.currency,
      receiverCurrency: receiver.currency,
      transactionDate: new Date(),  // Add the transaction date
      status: 'Completed',  // Default status
    });
    await transaction.save();

    // Respond with success message and transaction details
    res.status(200).json({
      message: 'Transaction successful',
      sentCurrency: sender.currency,  // Include the sent currency
      amount: senderAmount,           // Include the amount sent
      receiverUniqueId,
      receiverCurrency,
      exchangeRate,
    });
  } catch (error) {
    // In case of failure, log the transaction with 'Failed' status
    const failedTransaction = new Transaction({
      sender: senderUniqueId,
      receiver: receiverInput,
      senderAmount: amount,
      receiverAmount: 0,  // No amount sent in case of failure
      senderCurrency: 'USD',  // Assuming USD, or adjust based on your currency system
      receiverCurrency: 'USD',  // Assuming USD
      transactionDate: new Date(),
      status: 'Failed',  // Set status as Failed
    });
    await failedTransaction.save();

    // Respond with error message
    res.status(400).json({ message: error.message });
  }
});


// Route to fetch user's recent transactions
router.get('/history', async (req, res) => {
  const { uniqueId } = req.query;

  if (!uniqueId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const transactions = await Transaction.find({
      $or: [{ sender: uniqueId }, { receiver: uniqueId }],
    });

    const formattedTransactions = transactions.map((transaction) => ({
      transactionDate: transaction.transactionDate,
      sender: transaction.sender,
      receiver: transaction.receiver,
      senderAmount: transaction.senderAmount,
      senderCurrency: transaction.senderCurrency,
      receiverAmount: transaction.receiverAmount, // Converted amount
      receiverCurrency: transaction.receiverCurrency, // Currency after conversion
      exchangeRate: transaction.exchangeRate, // Exchange rate applied
      status: transaction.status,
    }));

    res.json({ transactions: formattedTransactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;
