import React from 'react';
import logo from '../img/logo.png';
import '../App.css';

function Header() {
  return (
    <div className="Header">
      <img
        className="Logo"
        src={logo}
        alt="Logo"
      />
    </div>
  );
}

export default Header;
