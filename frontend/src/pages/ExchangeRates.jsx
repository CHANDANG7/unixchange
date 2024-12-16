import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import "../styles/ExchangeRates.css";

const ExchangeRates = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null); // For storing the prediction result
  const [showPopup, setShowPopup] = useState(false); // To toggle the popup visibility
  const [isPredicting, setIsPredicting] = useState(false); // To show "Predicting..." message

  // Function to fetch exchange rates
  const fetchRates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/rates');
      console.log('Exchange Rates:', response.data);
      setRates(response.data);
      setLoading(false); // Stop loading once data is fetched
    } catch (err) {
      console.error('Error fetching rates:', err.message);
      setError('Failed to fetch exchange rates. Please try again.');
      setLoading(false); // Stop loading even if there's an error
    }
  };

  // Function to handle the prediction request
  const handlePrediction = async (baseCurrency, targetCurrency) => {
    const today = new Date();
    const day = today.getDate() + 1; // Increment the day by 1 to get the next day
    const month = today.getMonth() + 1; // Month is 0-based
    const year = today.getFullYear();

    // If it's the last day of the month, handle month and year rollover
    if (day > 31) {
        day = 1;
        month += 1;
    }

    if (month > 12) {
        month = 1;
        year += 1;
    }

    try {
        setIsPredicting(true); // Set predicting state to true immediately
        setShowPopup(true); // Show the popup as soon as the prediction process starts

        const response = await axios.post('http://localhost:5000/api/user/predict', {
            base_currency: baseCurrency,
            currency: targetCurrency,
            day,
            month,
            year
        });

        const { exchange_rate } = response.data;

        // Updated message with exchange_rate in bold
        setPrediction(`Predicted Exchange Rate for ${targetCurrency}: <strong>${exchange_rate}</strong> on  ${day}/${month}/${year}`);
        setIsPredicting(false); // Set predicting state to false once prediction is received
    } catch (err) {
        console.error('Error predicting exchange rate:', err.message);
        setPrediction('Failed to fetch prediction. Please try again.');
        setIsPredicting(false); // Set predicting state to false even if there's an error
    }
};

  // Fetch exchange rates initially when component mounts
  useEffect(() => {
    fetchRates();

    // Set an interval to update exchange rates every 2 hours (7200000 ms)
    const intervalId = setInterval(() => {
      fetchRates(); // Fetch rates again after 2 hours
    }, 7200000); // 2 hours = 2 * 60 * 60 * 1000 ms

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exchange-rates-container">
      <Navbar />
      <h1>Real-time Exchange Rates (Relative to USD)</h1>
      <table className="rates-table">
        <thead>
          <tr>
            <th>Currency</th>
            <th>Exchange Rate</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rates || {}).map(([currency, rate]) => (
            <tr key={currency}>
              <td>{currency}</td>
              <td>{rate}</td>
              <td>
                <button
                  className="predict-btn"
                  onClick={() => handlePrediction('USD', currency)} // 'USD' is the base currency
                >
                  Predict
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     {/* Popup Modal */}
{showPopup && (
  <div className="popup">
    <div className="popup-content">
      <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
      
      {/* Exchange Rate Prediction Header */}
      <div className="prediction-header">
        Exchange Rate Prediction
      </div>
      
      {/* Render prediction message with HTML (bold exchange_rate) */}
      <p dangerouslySetInnerHTML={{ __html: isPredicting ? "Predicting... Please wait..." : prediction }} />
    </div>
  </div>
)}

    </div>
  );
};

export default ExchangeRates;
