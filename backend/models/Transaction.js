// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  amount: { type: Number, required: true },
  senderCurrency: { type: String, required: true },
  receiverCurrency: { type: String, required: true },
  transactionDate: { type: Date, default: Date.now },
  transactionType: { type: String, required: true, enum: ['send', 'request'], default: 'send' },  // 'send' or 'request'
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
