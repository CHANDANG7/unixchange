const User = require('../models/User'); // Assuming you have a User model
const bcrypt = require('bcrypt');
const axios = require('axios');
const Transaction = require('../models/Transaction'); // Assuming you have a Transaction model

// Function to validate transaction details
const validateDetails = async (senderUniqueId, receiverInput, password, amount) => {
  // Check if the sender exists
  const sender = await User.findOne({ uniqueId: senderUniqueId });
  if (!sender) {
    throw new Error('Sender not found');
  }

  // Check if the receiver is identified by email or unique ID
  let receiver;
  if (/\S+@\S+\.\S+/.test(receiverInput)) {
    // If receiverInput is an email, find the receiver by email
    receiver = await User.findOne({ email: receiverInput });
  } else {
    // Otherwise, treat it as a unique ID
    receiver = await User.findOne({ uniqueId: receiverInput });
  }

  if (!receiver) {
    throw new Error('Receiver not found');
  }

  // Validate password (assuming password is hashed and stored)
  const isPasswordValid = await bcrypt.compare(password, sender.password); // If using bcrypt for password hashing
  if (!isPasswordValid) {
    throw new Error('Incorrect password');
  }

  // Additional checks: sender cannot send money to themselves
  if (sender.uniqueId === receiver.uniqueId) {
    throw new Error('Cannot send money to yourself');
  }

  // Check sender's balance for sufficient funds
  if (sender.balance < amount) {
    throw new Error('Insufficient balance');
  }

  // Assume we get the exchange rate from an API
  const exchangeRate = await getExchangeRate(sender.currency, receiver.currency);

  // Return receiver's details and exchange rate for validation success
  return { receiverUniqueId: receiver.uniqueId, receiverCurrency: receiver.currency, exchangeRate };
};

// Function to get exchange rates (you can replace this with an actual API call)
const getExchangeRate = async (fromCurrency, toCurrency) => {
  const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  const exchangeRates = response.data.rates;
  return exchangeRates[toCurrency] || 1; // Return 1 if no exchange rate found
};

// Function to log transaction details in the database
const logTransaction = async (senderUniqueId, receiverUniqueId, amount, exchangeRate) => {
  const newTransaction = new Transaction({
    sender: senderUniqueId,
    receiver: receiverUniqueId,
    amount,
    exchangeRate,
    transactionDate: new Date(),
  });

  await newTransaction.save();
};

module.exports = {
  validateDetails,
  getExchangeRate,
  logTransaction,
};
