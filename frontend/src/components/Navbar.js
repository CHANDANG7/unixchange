import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="app-name">UniXchange</h1>
      </div>
      <div className="navbar-right">
        <ul className="nav-links">
          <li>
            <NavLink to="/home" className="nav-button" activeClassName="active-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/exchange-rates" className="nav-button" activeClassName="active-link">
              Exchange Rates
            </NavLink>
          </li>
          <li>
            <NavLink to="/transactions" className="nav-button" activeClassName="active-link">
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink to="/alerts" className="nav-button" activeClassName="active-link">
              Alerts
            </NavLink>
          </li>
          <li>
            <NavLink to="/myaccount" className="nav-button" activeClassName="active-link">
              My Account
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
