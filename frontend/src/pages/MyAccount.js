import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/MyAccount.css';
import { FaEdit } from 'react-icons/fa';
import Navbar from '../components/Navbar';

// Utility function for currency formatting
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDepositFormVisible, setIsDepositFormVisible] = useState(false); // Toggle for deposit form visibility
  const navigate = useNavigate();

  // Retrieve email and uniqueId from localStorage
  const emailFromStorage = localStorage.getItem('email');
  const uniqueId = localStorage.getItem('uniqueId');

  useEffect(() => {
    if (!emailFromStorage && !uniqueId) {
      navigate('/'); // Redirect to login if credentials are missing
    } else if (emailFromStorage) {
      fetchUserDataByEmail(emailFromStorage);
    } else if (uniqueId) {
      fetchUserDataByUniqueId(uniqueId);
    }
  }, [emailFromStorage, uniqueId, navigate]);

  // Fetch user data by email
  const fetchUserDataByEmail = async (email) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/user/email/${encodeURIComponent(email)}`);
      setUser(response.data);
      setBalance(response.data.balance);
    } catch (err) {
      setError('Failed to fetch user data.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data by uniqueId
  const fetchUserDataByUniqueId = async (uniqueId) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/user/uniqueid/${uniqueId}`);
      setUser(response.data);
      setBalance(response.data.balance);
    } catch (err) {
      setError('Failed to fetch user data.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    let deposit = parseFloat(depositAmount);

    // Ensure it's a valid number and greater than zero
    if (isNaN(deposit) || deposit <= 0) {
      setError('Please enter a valid deposit amount.');
      return;
    }

    // Round the deposit to two decimal places (if needed, or to the nearest integer)
    deposit = Math.round(deposit * 100) / 100;  // Rounds to 2 decimal places

    // You might need to check the password here (example logic)
    if (!password) {
      setError('Please enter your password to proceed.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/user/${user.uniqueId}/deposit`, { amount: deposit, password });
      if (response.status === 200) {
        setSuccessMessage('Deposit successful!');
        setBalance(response.data.updatedBalance);
        setDepositAmount('');
        setPassword('');
        setIsDepositFormVisible(false); // Hide form after successful deposit
        setError(''); // Clear error message
      } else {
        setError('Deposit failed. Please try again.');
        setSuccessMessage(''); // Clear success message
      }
    } catch (err) {
      console.error('Error depositing funds:', err);
      setError('Deposit failed. Please try again.');
      setSuccessMessage(''); // Clear success message
    }
};


  // Toggle deposit form visibility
  const toggleDepositForm = () => {
    setIsDepositFormVisible(!isDepositFormVisible);
    setError(''); 
    setSuccessMessage(''); 
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('uniqueId');
    navigate('/');
  };

  return (
    <div className="myaccount-container">
      {loading && <p>Loading user data...</p>}
      {error && <p className="error-message">{error}</p>}

      {user && !loading && (
        <>
        <Navbar />
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Unique ID: {user.uniqueId}</p>
          <p>Country: {user.country}</p>

          <p>
            Balance: {formatCurrency(balance, user.currency)}
            <button className="deposit-toggle-btn" onClick={toggleDepositForm}>+</button>
          </p>

          {isDepositFormVisible && (
            <div className="deposit-section">
              <h3>Deposit Money</h3>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter deposit amount"
                min="1"
                step="0.01"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to deposit"
              />
              <button onClick={handleDeposit}>Deposit</button>
              <button onClick={() => setIsDepositFormVisible(false)}>Cancel</button>

              {error && <p className="error-message">{error}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
          )}

          {/* Edit Profile Button */}
          <button className="edit-profile-btn" onClick={() => navigate('/edit-profile')}>
            <FaEdit /> Edit Profile
          </button>

          <div className="logout-button-container">
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyAccount;