import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle "Send Money" click
  const handleSendMoneyClick = () => {
    navigate("/send-money"); // Navigate to SendMoneyPage
  };
  const handleRequestMoneyClick = () => {
    navigate('/request-money'); // Navigate to the request money page
  };

  return (
    <div>
      <Navbar />
      <div className="home-body">
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
