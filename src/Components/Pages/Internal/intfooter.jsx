import React from 'react'
import { useNavigate } from 'react-router-dom';
import './internalStyle.css';

function Intfooter() {
  const navigate = useNavigate();

  const handleBookingsClick = () => {
    navigate("/Bookings"); // Use navigate function to redirect
  };

  const handleHomeClick = () => {
    navigate("/"); // Use navigate function to redirect
  };

  const reroutePpov = () => {
    navigate("https://perspectivepov.co.za/"); // Use navigate function to redirect
  };

  return (
    <div className="intfooter">
         <ul>
          <li onClick={handleHomeClick}>Home</li>
          <li onClick={handleBookingsClick}>Bookings</li>
        </ul>

        <p>designed&developed {" "}
          <a href="https://perspectivepov.co.za" target="_blank" rel="noopener noreferrer">
            @perspectivepov.co.za
          </a>
        </p>
    </div>
  )
}

export default Intfooter