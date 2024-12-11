const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // Use String for user IDs
  receiver: { type: String, required: true }, // Use String for user IDs
  senderAmount: { type: Number, required: true }, // Amount in sender's currency
  receiverAmount: { type: Number, required: true }, // Amount in receiver's currency
  senderCurrency: { type: String, required: true }, // Sender's currency
  receiverCurrency: { type: String, required: true }, // Receiver's currency
  transactionDate: { type: Date, default: Date.now }, // Transaction timestamp
  status: { type: String, default: 'Completed' }, // Transaction status
});

module.exports = mongoose.model('Transaction', transactionSchema);
