import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios"; // For making API calls
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [user, setUser] = useState(null); // State to store fetched user details
  const [balance, setBalance] = useState(""); // State to store user's balance
  const [loading, setLoading] = useState(false); // State to track loading state
  const [error, setError] = useState(""); // State to handle errors

  // Function to handle "Send Money" click
  const handleSendMoneyClick = () => {
    navigate("/send-money"); // Navigate to SendMoneyPage
  };

  const handleRequestMoneyClick = () => {
    navigate('/request-money'); // Navigate to the request money page
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

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

  // Function to handle search submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!searchInput) return;

    setLoading(true);
    setError(""); // Clear previous errors

    // Check if input is an email or uniqueId
    const isEmail = /\S+@\S+\.\S+/.test(searchInput); // Regex to check if the input is a valid email

    if (isEmail) {
      // Fetch user data by email if the input is an email
      await fetchUserDataByEmail(searchInput);
    } else {
      // Fetch user data by uniqueId if the input is not an email
      await fetchUserDataByUniqueId(searchInput);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="home-body">
        {/* Search Section placed below Navbar and above "Send Money" */}
        <div className="search-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search by Email or UniqueID"
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fa fa-search"></i> {/* You can use FontAwesome search icon */}
            </button>
          </form>
          
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}

          {user && (
            <div className="user-details">
              <h3>User Details:</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Unique ID:</strong> {user.uniqueId}</p>
              <p><strong>Balance:</strong> {balance} {user.currency}</p>
            </div>
          )}
        </div>

        <div className="money-options">
          {/* "Send Money" Option with click handler */}
          <div className="option send-money" onClick={handleSendMoneyClick}>
            <h2>Send Money</h2>
            <p>Quickly and securely transfer money to other UniXchange users.</p>
          </div>
          <div className="option receive-money" onClick={handleRequestMoneyClick}>
            <h2>Receive Money</h2>
            <p>Request payments easily by providing your unique ID.</p>
          </div>
        </div>

        <div className="recent-news">
          <h2>Recent News on International Transactions</h2>
          <div className="news-item">
            <img src="/images/news1.jpeg" alt="News 1" className="news-image" />
            <div className="news-content">
              <h3>New Currency Exchange Regulations</h3>
              <p>
                The international transaction landscape is evolving with new currency
                exchange regulations aimed at streamlining cross-border transactions.
                Read more about how these changes will impact global financial systems.
              </p>
            </div>
          </div>
          <div className="news-item">
            <img src="/images/news2.jpeg" alt="News 2" className="news-image" />
            <div className="news-content">
              <h3>Blockchain Revolutionizing Cross-Border Payments</h3>
              <p>
                Blockchain technology continues to disrupt international transactions by
                providing faster, secure, and transparent ways to transfer money across borders.
                Discover the latest innovations in this space.
              </p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>About UniXchange</h2>
          <p>
            UniXchange is a platform designed for seamless international transactions. 
            Stay updated with real-time exchange rates and manage your money effectively.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
