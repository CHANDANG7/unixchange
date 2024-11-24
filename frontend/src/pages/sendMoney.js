// src/pages/SendMoneyPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';  // Corrected Navbar import
import '../styles/sendMoney.css';  // Add the necessary CSS

const SendMoneyPage = () => {
  const [receiverUniqueId, setReceiverUniqueId] = useState('');
  const [receiverCurrency, setReceiverCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [transactionMessage, setTransactionMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendMoney = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTransactionMessage('');
    
    try {
      // Assuming uniqueId is stored in localStorage after login
      const senderUniqueId = localStorage.getItem('uniqueId');
      if (!senderUniqueId) {
        throw new Error('User is not logged in.');
      }
      
      const senderCurrency = 'USD'; // Adjust this as per your app's logic for sender's currency

      // Send the money transaction request
      const response = await axios.post('http://localhost:5000/api/transaction/send', {
        senderUniqueId,
        receiverUniqueId,
        receiverCurrency,
        amount,
        password,
        senderCurrency,
      });

      setTransactionMessage(response.data.message); // Show transaction success message
      setLoading(false);

      // Redirect to home or transaction history page after success
      setTimeout(() => {
        navigate('/home');
      }, 2000);

    } catch (err) {
      setLoading(false);
      setTransactionMessage(err.response?.data?.message || 'Transaction failed');
    }
  };

  return (
    <>
      <Navbar />  {/* Corrected Navbar */}
      <div className="send-money-container">
        <h1>Send Money</h1>
        <form onSubmit={handleSendMoney}>
          <input
            type="text"
            placeholder="Receiver's Unique ID"
            value={receiverUniqueId}
            onChange={(e) => setReceiverUniqueId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Receiver's Currency"
            value={receiverCurrency}
            onChange={(e) => setReceiverCurrency(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount to Send"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </form>

        {transactionMessage && <p>{transactionMessage}</p>}  {/* Show transaction message */}
      </div>
    </>
  );
};

export default SendMoneyPage;
