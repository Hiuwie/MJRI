import React from 'react';
import './LandingStyle.css';
import { useNavigate } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleBookingsClick = () => {
    navigate("/Bookings"); // Use navigate function to redirect
  };

  const handleHomeClick = () => {
    navigate("/"); // Use navigate function to redirect
  };

  return (
    <div className="nav" >
      <div className="logo-area" onClick={handleHomeClick} >
        <img src="assets/Logo/Remove Background Preview from MJ Records.png" alt="logo" />
      </div>

      <ul>
        <li onClick={handleHomeClick}>Home</li>
        <li onClick={handleBookingsClick}>Bookings</li>
        {/* <li >Contact</li> */}
      </ul>
    </div>
  );
}

export default Nav;
