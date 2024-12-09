import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/sendMoney.css';

const SendMoneyPage = () => {
  const [receiverInput, setReceiverInput] = useState('');
  const [senderCurrency, setSenderCurrency] = useState('INR');
  const [receiverCurrency, setReceiverCurrency] = useState('INR');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [transactionMessage, setTransactionMessage] = useState('');
  const [currencies, setCurrencies] = useState(['INR', 'USD', 'EUR', 'GBP', 'AUD']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Populate currencies if needed (Currently hardcoded)
    setCurrencies(['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CNY']);
  }, []);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    // Check if the entered amount is less than or equal to 1
    if (value <= 1 || value === '') {
      setError('Amount must be greater than 1');
    } else {
      setError('');
    }
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    if (error) {
      setTransactionMessage('Please correct the errors before proceeding.');
      return;
    }
    
    setLoading(true);
    setTransactionMessage('');

    try {
      const senderUniqueId = localStorage.getItem('uniqueId');
      if (!senderUniqueId) {
        throw new Error('User is not logged in.');
      }

      // Make validation request to backend
      const validationResponse = await axios.post('http://localhost:5000/api/transaction/validate', {
        senderUniqueId,
        receiverInput,
        password,
        amount,
      });

      // Check if validation response indicates receiver does not exist
      if (validationResponse.data.message === 'Receiver does not exist') {
        setTransactionMessage('Receiver does not exist');
        setLoading(false);
        return;  // Stop here if receiver does not exist
      }

      const { receiverUniqueId, receiverCurrency, exchangeRate } = validationResponse.data;

      // Proceed with sending money after validation
      const transactionResponse = await axios.post('http://localhost:5000/api/transaction/sendMoney', {
        senderUniqueId,
        receiverInput,  // Use receiverInput instead of receiverUniqueId
        password,
        amount,
      });

      // Success message with sent currency and amount
      setTransactionMessage(`${transactionResponse.data.message}. Sent Currency: ${transactionResponse.data.sentCurrency}. Amount: ${transactionResponse.data.amount}`);
      setLoading(false);

      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setLoading(false);

      // Check for backend response errors
      if (err.response && err.response.data) {
        if (err.response.data.message === 'Incorrect password') {
          setTransactionMessage('Enter correct password');
        } else if (err.response.data.message === 'Receiver not found') {
          setTransactionMessage('Receiver not found');
        } else if (err.response.data.message === 'Insufficient balance') {
          setTransactionMessage('Insufficient balance');
        } else {
          setTransactionMessage(err.response.data.message || 'Transaction failed');
        }
      } else {
        setTransactionMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="send-money-container">
        <h1>Send Money</h1>
        <form onSubmit={handleSendMoney}>
          <div className="form-group">
            <label htmlFor="receiverInput">Receiver's Unique ID or Email:</label>
            <input
              type="text"
              id="receiverInput"
              value={receiverInput}
              onChange={(e) => setReceiverInput(e.target.value)}
              placeholder="Receiver's Unique ID or Email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senderCurrency">Sender's Currency:</label>
            <select
              id="senderCurrency"
              value={senderCurrency}
              onChange={(e) => setSenderCurrency(e.target.value)}
              required
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="receiverCurrency">Receiver's Currency:</label>
            <select
              id="receiverCurrency"
              value={receiverCurrency}
              onChange={(e) => setReceiverCurrency(e.target.value)}
              required
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount to Send:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount to Send"
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </form>

        {transactionMessage && (
          <div className={`transaction-message ${loading ? 'loading' : ''}`}>
            {transactionMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default SendMoneyPage;
