const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const axios = require('axios'); // Importing axios for API requests

// Fetch exchange rate from API (Example using Exchangerate-API)
const getExchangeRate = async (senderCurrency, receiverCurrency) => {
  try {
    // API URL with dynamic senderCurrency
    const url = `https://v6.exchangerate-api.com/v6/788196cbe1390754c7ad0823/latest/${receiverCurrency}`;
    const response = await axios.get(url);
    
    // Fetching the exchange rate from senderCurrency to receiverCurrency
    const exchangeRate = response.data.rates[senderCurrency];

    if (!exchangeRate) {
      throw new Error(`Exchange rate not found for ${senderCurrency} to ${receiverCurrency}`);
    }

    return exchangeRate;
  } catch (err) {
    console.error('Error fetching exchange rate:', err);
    throw new Error('Failed to fetch exchange rate');
  }
};

// POST: Request money
router.post('/requestMoney', async (req, res) => {
  console.log("Request Money route is hit");

  const { requesterId, senderId, amount, senderCurrency, receiverCurrency } = req.body;

  // Validate amount
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Amount should be a positive number' });
  }

  try {
    let sender;
    if (/\S+@\S+\.\S+/.test(senderId)) {
      sender = await User.findOne({ email: senderId });
    } else {
      sender = await User.findOne({ uniqueId: senderId });
    }

    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    const receiver = await User.findOne({ uniqueId: requesterId });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Get exchange rate dynamically from API
    const exchangeRate = await getExchangeRate(senderCurrency, receiverCurrency);
    const convertedAmount = amount * exchangeRate;

    const request = new Request({
      requesterId,
      receiverId: requesterId,
      receiverName: receiver.name,
      senderId: sender.uniqueId,
      amount,
      senderCurrency,
      receiverCurrency,
      convertedAmount,
      date: new Date(),
      status: 'Pending',
      message: '', // Default empty message
    });

    await request.save();
    res.status(200).json({ message: 'Request sent successfully', request });
  } catch (err) {
    console.error("Error in requestMoney route:", err);
    res.status(500).json({ message: 'An error occurred while sending the request' });
  }
});

// POST: Cancel a money request
router.post('/cancelRequest', async (req, res) => {
  const { requestId } = req.body;

  try {
    // Find the request by its ID
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Delete the request after cancellation
    await request.remove();

    res.status(200).json({ message: 'Request canceled successfully and deleted from database' });
  } catch (err) {
    console.error('Error canceling request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Complete a money request
router.post('/completeRequest', async (req, res) => {
  const { requestId, senderPassword } = req.body;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const sender = await User.findOne({ uniqueId: request.senderId });
    if (!sender || sender.password !== senderPassword) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    if (sender.balance < request.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const receiver = await User.findOne({ uniqueId: request.requesterId });
    sender.balance -= request.amount;
    receiver.balance += request.convertedAmount;

    await sender.save();
    await receiver.save();

    request.status = 'Completed';
    request.message = 'Transaction completed successfully.';
    await request.save();

    res.status(200).json({ message: 'Transaction completed successfully' });
  } catch (err) {
    console.error("Error completing request:", err);
    res.status(500).json({ message: 'An error occurred while completing the request' });
  }
});

// GET: Fetch pending requests for the sender
router.get('/fetchRequests', async (req, res) => {
  const { senderId } = req.query;

  try {
    const requests = await Request.find({ senderId, status: 'Pending' });
    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// GET: Fetch completed requests for the receiver
router.get('/completedRequests', async (req, res) => {
  const { receiverId } = req.query;

  try {
    const requests = await Request.find({ requesterId: receiverId, status: 'Completed' });
    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error fetching completed requests:", err);
    res.status(500).json({ message: 'Failed to fetch completed requests' });
  }
});

module.exports = router;
