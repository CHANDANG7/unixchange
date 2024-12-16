// React Component: RequestMoneyPage
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from "../components/Navbar";
import "../styles/requestMoney.css";

const RequestMoneyPage = () => {
  const [senderIdentifier, setSenderIdentifier] = useState(''); // Email or unique ID
  const [amount, setAmount] = useState('');
  const [senderCurrency, setSenderCurrency] = useState('');
  const [receiverCurrency, setReceiverCurrency] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();

  // Currency options
  const currencyOptions = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'INR', 'JPY'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requesterId = localStorage.getItem('uniqueId'); // Retrieve requester unique ID

    try {
      const response = await axios.post('http://localhost:5000/api/request/requestMoney', {
        requesterId,
        senderId: senderIdentifier,  // Sender identifier
        amount,
        senderCurrency,
        receiverCurrency,
      });

      setMessage(response.data.message || 'Request sent successfully!');
      setMessageType('success');
    } catch (err) {
      console.error("Error in request submission:", err);
      const errorMsg = err.response?.data?.message || 'Failed to send request';
      setMessage(errorMsg);
      setMessageType('error');
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirect to home
  };

  return (
    <>
      <Navbar />
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Sender Unique ID or Email:
          <input
            type="text"
            value={senderIdentifier}
            onChange={(e) => setSenderIdentifier(e.target.value)}
            required
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Sender Currency:
          <select
            value={senderCurrency}
            onChange={(e) => setSenderCurrency(e.target.value)}
            required
          >
            <option value="">Select Currency</option>
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </label>
        <label>
          Receiver Currency:
          <select
            value={receiverCurrency}
            onChange={(e) => setReceiverCurrency(e.target.value)}
            required
          >
            <option value="">Select Currency</option>
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </label>
        <div className="button-container">
          <button type="submit">Request</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </>
  );
};

export default RequestMoneyPage;