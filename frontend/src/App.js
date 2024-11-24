import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home"; // Ensure you have this Home component
import MyAccount from "./pages/MyAccount"; // Ensure the MyAccount component is imported
import SendMoneyPage from './pages/sendMoney';
import RequestMoneyPage from './pages/requestMoney';
import EditProfile from './components/EditProfile';
import ExchangeRates from './pages/ExchangeRates';

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
        <Route path="/exchange-rates" element={<ExchangeRates/>} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
