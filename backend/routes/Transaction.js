const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Transaction = require('../models/Transaction');

// Route to handle sending money
router.post('/send', async (req, res) => {
  const { senderUniqueId, receiverUniqueId, amount, password, senderCurrency, receiverCurrency } = req.body;

  try {
    // Find sender and receiver by unique ID
    const sender = await User.findOne({ uniqueId: senderUniqueId });
    const receiver = await User.findOne({ uniqueId: receiverUniqueId });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }

    // Check if sender's password is correct
    const isPasswordCorrect = await bcrypt.compare(password, sender.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Check if sender has enough balance
    if (sender.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update sender's balance
    sender.walletBalance -= amount;
    await sender.save();

    // Update receiver's balance
    receiver.walletBalance += amount;
    await receiver.save();

    // Create a transaction record
    const transaction = new Transaction({
      sender: senderUniqueId,
      receiver: receiverUniqueId,
      amount,
      senderCurrency,
      receiverCurrency,
      transactionDate: new Date(),
    });
    await transaction.save();

    res.status(200).json({ message: 'Transaction successful', updatedBalance: sender.walletBalance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all transactions for a user
router.get('/user/:uniqueId', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { sender: req.params.uniqueId },
        { receiver: req.params.uniqueId },
      ],
    }).sort({ transactionDate: -1 }); // Sort transactions by date descending

    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
