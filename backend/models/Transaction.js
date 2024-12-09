const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // Use String for user IDs
  receiver: { type: String, required: true }, // Use String for user IDs
  amount: { type: Number, required: true },
  senderCurrency: { type: String, required: true },
  receiverCurrency: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
