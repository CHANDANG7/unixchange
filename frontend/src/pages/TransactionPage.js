import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';  // Assuming you have Navbar component
import '../styles/TransactionPage.css';  // Add your styles

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const senderUniqueId = localStorage.getItem('uniqueId');
      
      if (!senderUniqueId) {
        navigate('/login');  // Redirect to login if the user is not logged in
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/transaction/history', {
          params: { senderUniqueId }
        });
        setTransactions(response.data.transactions);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load transactions');
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, [navigate]);

  if (loading) return <p>Loading transactions...</p>;

  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="transaction-page-container">
        <h1>Recent Transactions</h1>
        {transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                  <td>{transaction.sender}</td>
                  <td>{transaction.receiver}</td>
                  <td>{transaction.convertedAmount}</td>
                  <td>{transaction.status || 'Completed'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TransactionPage;
