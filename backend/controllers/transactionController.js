const { validateDetails, updateBalances, logTransaction } = require('../services/transactionService');

/**
 * Validates the transaction details before proceeding.
 * @param {Object} req - The request object containing transaction details.
 * @param {Object} res - The response object to send the result.
 */
const validateTransaction = async (req, res) => {
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
};

/**
 * Processes a transaction and updates balances.
 * @param {Object} req - The request object containing transaction details.
 * @param {Object} res - The response object to send the result.
 */
const sendTransaction = async (req, res) => {
  const { senderUniqueId, receiverInput, amount, password } = req.body;

  try {
    // Validate sender, receiver, and transaction details
    const { receiverUniqueId, receiverCurrency, exchangeRate } = await validateDetails(
      senderUniqueId,
      receiverInput,
      password,
      amount
    );

    // Convert the amount to the receiver's currency
    const convertedAmount = amount * exchangeRate;

    // Update sender's and receiver's balances
    await updateBalances(senderUniqueId, receiverUniqueId, amount, convertedAmount);

    // Log the transaction
    await logTransaction({
      sender: senderUniqueId,
      receiver: receiverUniqueId,
      senderCurrency: 'USD', // Replace with actual sender currency
      receiverCurrency,
      amount,
      convertedAmount,
      transactionDate: new Date(),
    });

    res.status(200).json({ message: 'Transaction successful', convertedAmount });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { validateTransaction, sendTransaction };
