// models/Request.js
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  requesterId: { type: String, required: true },
  receiverId: { type: String, required: true },
  receiverName: { type: String, required: true },
  senderId: { type: String, required: true },
  amount: { type: Number, required: true },
  senderCurrency: { type: String, required: true },
  receiverCurrency: { type: String, required: true },
  convertedAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  message: { type: String, default: '' },  // Added message field
});

module.exports = mongoose.model('Request', RequestSchema);
