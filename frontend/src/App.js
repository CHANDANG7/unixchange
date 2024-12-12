import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Ensure BrowserRouter is imported
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home'; 
import MyAccount from './pages/MyAccount'; 
import SendMoneyPage from './pages/sendMoney';
import RequestMoneyPage from './pages/requestMoneyPage';
import EditProfile from './components/EditProfile';
import ExchangeRates from './pages/ExchangeRates';
import TransactionPage from './pages/TransactionPage';
import AlertPage from './pages/alertPage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/send-money" element={<SendMoneyPage />} />
        <Route path="/request-money" element={<RequestMoneyPage />} />
        <Route path="/exchange-rates" element={<ExchangeRates />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/alerts" element={<AlertPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
