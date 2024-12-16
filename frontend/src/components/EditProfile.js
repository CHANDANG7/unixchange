import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currency, setCurrency] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const uniqueId = localStorage.getItem('uniqueId');

  useEffect(() => {
    if (!uniqueId) {
      navigate('/'); // Redirect if no uniqueId
    } else {
      fetchUserData();
    }
  }, [uniqueId, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/uniqueId/${uniqueId}`);
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setCurrency(response.data.currency);
    } catch (err) {
      setError('Failed to fetch user data.');
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleProfileUpdate = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setSuccessMessage('');
      return;
    }

    if (newPassword.trim() && !validatePassword(newPassword)) {
      setError('Password must be at least 6 characters long.');
      setSuccessMessage('');
      return;
    }

    const updatedData = {};
    if (name !== user.name) updatedData.name = name;
    if (email !== user.email) updatedData.email = email;
    if (newPassword.trim()) updatedData.password = newPassword;
    if (currency !== user.currency) updatedData.currency = currency;

    if (Object.keys(updatedData).length === 0) {
      setError('No changes to update');
      setSuccessMessage('');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/user/${uniqueId}/update`, updatedData);
      if (response.status === 200) {
        setSuccessMessage('Profile updated successfully');
        setError('');
        navigate('/myaccount');
      } else {
        setError('Profile update failed');
        setSuccessMessage('');
      }
    } catch (err) {
      setError('Profile update failed');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {user && (
        <div className="edit-profile-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter new email"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <div className="currency-select">
            <label htmlFor="currency">Choose your currency:</label>
            <select id="currency" value={currency} onChange={handleCurrencyChange}>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="INR">INR (Indian Rupee)</option>
              <option value="GBP">GBP (British Pound)</option>
              <option value="AUD">AUD (Australian Dollar)</option>
              <option value="CAD">CAD (Canadian Dollar)</option>
              <option value="JPY">JPY (Japanese Yen)</option>
              <option value="CNY">CNY (Chinese Yuan)</option>
            </select>
          </div>
          <div className="buttons">
            <button onClick={handleProfileUpdate} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => navigate('/myaccount')}>Cancel</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default EditProfile;
