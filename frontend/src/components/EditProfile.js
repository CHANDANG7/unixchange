import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currency, setCurrency] = useState(''); // State for currency
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  // Retrieve user uniqueId from localStorage
  const uniqueId = localStorage.getItem('uniqueId');

  useEffect(() => {
    if (!uniqueId) {
      navigate('/'); // Redirect to login if no uniqueId in localStorage
    } else {
      fetchUserData();
    }
  }, [uniqueId, navigate]);

  // Fetch user data to populate the fields
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/uniqueId/${uniqueId}`);
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setCurrency(response.data.currency); // Set the currency from the user data
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data.');
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    const updatedData = {};

    // Only add fields to updatedData if they have changed
    if (name !== user.name) updatedData.name = name;
    if (email !== user.email) updatedData.email = email;
    if (newPassword.trim()) updatedData.password = newPassword; // Only add if password is provided
    if (currency !== user.currency) updatedData.currency = currency;

    if (Object.keys(updatedData).length === 0) {
      setError('No changes to update');
      setSuccessMessage(''); // Clear success message
      return;
    }

    console.log(updatedData); // Log the data being sent to the backend

    try {
      setLoading(true); // Set loading to true
      const response = await axios.put(`http://localhost:5000/api/user/${uniqueId}/update`, updatedData);
      if (response.status === 200) {
        setSuccessMessage('Profile updated successfully');
        setError(''); // Clear any error messages
        navigate('/myaccount'); // Redirect back to MyAccount page after update
      } else {
        setError('Profile update failed');
        setSuccessMessage(''); // Clear success message
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Profile update failed');
      } else {
        setError('Profile update failed');
      }
      setSuccessMessage(''); // Clear success message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Handle currency change
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

          {/* Currency Select Dropdown */}
          <div className="currency-select">
            <label htmlFor="currency">Choose your currency:</label>
            <select
              id="currency"
              value={currency}
              onChange={handleCurrencyChange}
            >
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

          {/* Display error or success message */}
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default EditProfile;
