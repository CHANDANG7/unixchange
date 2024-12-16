import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (response.status === 200) {
        const { uniqueId, name, country, balance } = response.data;

        // Storing user info in localStorage
        localStorage.setItem('email', email);  // Store email for future reference
        localStorage.setItem('uniqueId', uniqueId);
        localStorage.setItem('user', JSON.stringify({ name, email, country, balance }));

        // Redirect to Home page or My Account page
        navigate('/home');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{ backgroundColor: 'blue', padding: '30px', color: 'white' }}>
        <h2>uniXchange</h2>
      </nav>

      {/* Login Container */}
      <div className="login-container">
        <div className="welcome-message">
          <h1>Welcome Back!</h1>
          <p>Please login to continue.</p>
        </div>
        <div className="login-body">
          <div className="login-logo">
            <img src="/images/uniXchange.png" alt="Logo" />
          </div>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
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
              <button type="submit">Login</button>
            </form>

            {/* Display error message if login fails */}
            {error && <p className="error-message">{error}</p>}

            <div className="redirect-register">
              <p>
                Not registered? <Link to="/register">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
