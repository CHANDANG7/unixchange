import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendMoneyClick = () => {
    navigate("/send-money");
  };

  const handleRequestMoneyClick = () => {
    navigate("/request-money");
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const fetchUserData = async (input) => {
    setLoading(true);
    setError("");
    try {
      const isEmail = /\S+@\S+\.\S+/.test(input);
      const endpoint = isEmail
        ? `http://localhost:5000/api/user/email/${encodeURIComponent(input)}`
        : `http://localhost:5000/api/user/uniqueid/${input}`;
      const response = await axios.get(endpoint);
      setUser(response.data);
    } catch (err) {
      setError("Failed to fetch user data.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput) {
      fetchUserData(searchInput);
    }
  };

  const handleCloseUserDetails = () => {
    setUser(null);
    setSearchInput("");
  };

  return (
    <div>
      <Navbar />
      <div className="home-body">
      <div className="search-section">
      <div className="search-bar-container">
       <input
      type="text"
      value={searchInput}
      onChange={handleSearchChange}
      placeholder="Search by Email or UniqueID"
      className="search-bar-input"
    />
    <i className="fas fa-search" onClick={handleSearchSubmit}>submit</i>
  </div>

  {loading && <p>Loading...</p>}
  {error && <p>{error}</p>}

  {user && (
    <div className="user-details">
      <button
        className="close-button"
        onClick={handleCloseUserDetails}
      >
        X
      </button>
      <h3>User Details:</h3>
      <p><strong>Unique ID:</strong> {user.uniqueId}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Country:</strong> {user.country}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  )}
</div>


        <div className="money-options">
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
