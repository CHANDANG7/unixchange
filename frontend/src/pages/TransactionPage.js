import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Assuming you have Navbar component
import '../styles/TransactionPage.css'; // Add your styles

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const uniqueId = localStorage.getItem('uniqueId');

      if (!uniqueId) {
        navigate('/login'); // Redirect to login if the user is not logged in
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/transaction/history', {
          params: { uniqueId },  // Ensure that the parameter key matches the backend
        });

        // Filter transactions to include only those relevant to the logged-in user
        const filteredTransactions = response.data.transactions.filter(
          (transaction) => transaction.sender === uniqueId || transaction.receiver === uniqueId
        );

        setTransactions(filteredTransactions);
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

  const userId = localStorage.getItem('uniqueId'); // Get the logged-in user's ID

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
                <th>Transaction Type</th> {/* New column for Credit/Debit */}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                  <td>{transaction.sender}</td>
                  <td>{transaction.receiver}</td>
                  <td>
                    {transaction.sender === userId ? (
                      `${transaction.senderAmount} ${transaction.senderCurrency || 'Currency'}` // For sender
                    ) : transaction.receiver === userId ? (
                      `${transaction.receiverAmount} ${transaction.receiverCurrency || 'Currency'}` // For receiver
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{transaction.status || 'Completed'}</td>
                  <td>
                    {/* Check if the transaction is for the logged-in user */}
                    {transaction.sender === userId
                      ? 'Debited'  // User is the sender (money is debited)
                      : transaction.receiver === userId
                      ? 'Credited'  // User is the receiver (money is credited)
                      : ''}
                  </td>
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
