// src/pages/RequestMoneyPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/requestMoney.css';  // Add the necessary CSS for styling

const RequestMoneyPage = () => {
  const [senderUniqueId, setSenderUniqueId] = useState('');
  const [receiverUniqueId, setReceiverUniqueId] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRequestMoney = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Assuming receiver's unique ID is stored in localStorage after login
      const receiverUniqueId = localStorage.getItem('uniqueId');
      if (!receiverUniqueId) {
        throw new Error('User is not logged in.');
      }

      // Send the request for money
      const response = await axios.post('http://localhost:5000/api/transaction/request', {
        senderUniqueId,
        receiverUniqueId,
        currency,
        amount,
      });

      setMessage(response.data.message); // Show success or error message
      setLoading(false);

      // Redirect to the home page after the request is processed
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="request-money-container">
        <h1>Request Money</h1>
        <form onSubmit={handleRequestMoney}>
          <input
            type="text"
            placeholder="Sender's Unique ID"
            value={senderUniqueId}
            onChange={(e) => setSenderUniqueId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Receiver's Unique ID"
            value={receiverUniqueId}
            onChange={(e) => setReceiverUniqueId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Request Money'}
          </button>
        </form>

        {message && <p>{message}</p>}  {/* Display success or error message */}
      </div>
    </>
  );
};

export default RequestMoneyPage;
