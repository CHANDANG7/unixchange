import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Registration = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default to USD
  const [uniqueId, setUniqueId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Make POST request to register user
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        country,
        email,
        password,
        currency,
      });

      // If registration is successful, set the uniqueId and redirect
      setUniqueId(res.data.uniqueId); // Set the unique ID from the response
      setTimeout(() => {
        navigate('/'); // Redirect to login page after successful registration
      }, 1000); // Wait for 1 second before redirecting

    } catch (err) {
      // Handle errors based on response
      if (err.response && err.response.data) {
        // Specific backend error
        if (err.response.data.message.includes('duplicate key')) {
          setError('User already exists. Please use a different email.');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        // General error
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{ backgroundColor: 'blue', padding: '30px', color: 'white' }}>
        <div className="registration-container">
          <div className="welcome-message">
            <h1>Welcome!</h1>
            <p>Create your account to get started.</p>
          </div>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="registration-container">
        <div className="registration-body">
          <div className="registration-form">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {/* Currency selection */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
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

              <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            {/* Display error message if registration fails */}
            {error && <p className="error-message">{error}</p>}

            {/* Display unique ID after successful registration */}
            {uniqueId && (
              <div className="unique-id">
                <p>Your unique ID: {uniqueId}</p>
              </div>
            )}

            <div className="login-redirect">
              <p>Already have an account?</p>
              <button onClick={() => navigate('/')}>Go to Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
