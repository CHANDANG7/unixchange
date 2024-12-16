import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import "../styles/ExchangeRates.css";

const ExchangeRates = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                <button className="predict-btn" onClick={() => alert(`Predicting for ${currency}`)}>
                  Predict
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExchangeRates;
