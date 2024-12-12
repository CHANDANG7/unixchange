import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import '../styles/sendAlert.css';

const AlertPage = () => {
  const [requests, setRequests] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const uniqueId = localStorage.getItem('uniqueId');
  const navigate = useNavigate();

  const isSender = true; // Assuming the logged-in user is a sender

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/request/fetchRequests', {
          params: { senderId: uniqueId },
        });
        setRequests(response.data.requests);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    fetchRequests();
  }, [uniqueId]);

  const handleSendMoney = (requestId, amount, senderCurrency, receiverEmail) => {
    // Redirect to the SendMoneyPage with necessary data
    navigate(`/send-money/`, { 
      state: { 
        amount, 
        senderCurrency, 
        receiverEmail, // Pass the receiver email/ID to SendMoneyPage
        receiverCurrency: senderCurrency,  // Default receiver currency to sender's currency
      }
    });
    setAlertMessage('Money request sent successfully!');
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/request/cancelRequest', { requestId });
      if (response.data.message === 'Request cancelled successfully') {
        setAlertMessage('Request cancelled successfully!');
        setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
      } else {
        setAlertMessage('Failed to cancel request');
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
      setAlertMessage('Failed to cancel request');
    }
  };

  return (
    <>
      <Navbar />
      <div className="sender-alert-container">
        <h1>Your Pending Requests</h1>
        {alertMessage && <div className="alert-message">{alertMessage}</div>}
        
        {requests.length > 0 ? (
          <table className="request-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Sender Name</th>
                <th>Amount ({'Sender Currency'})</th>
                <th>Date of Request</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req._id}</td>
                  <td>{req.senderName || 'Unknown Sender'}</td>
                  <td>{req.convertedAmount.toFixed(3)} {req.senderCurrency}</td>
                  <td>{new Date(req.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="send-btn"
                      onClick={() => handleSendMoney(req._id, req.convertedAmount, req.senderCurrency, req.receiverEmail)}
                    >
                      Send Now
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelRequest(req._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending requests.</p>
        )}
      </div>
    </>
  );
};

export default AlertPage;
