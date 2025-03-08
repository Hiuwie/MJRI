
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import './internalStyle.css';

function Intheader() {
  const [user, setUser] = useState(null); // State to hold user information
  const navigate = useNavigate();

  // Fetch user info when the component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || 'Guest',
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <div className="header">
      <div className="logo-wrapper">
        <div className="logo-area">
          <img src="assets/Logo/Remove Background Preview from MJ Records.png" alt="logo" />
        </div>
        <h1>
          Booking and Management <br /> Dashboard
        </h1>
      </div>

      <div className="user-info">
        {user ? (
          <>
            <p>
              Signed in as: <strong>{user.displayName}</strong> 
            </p>
            {/* <p>
              Email: <strong>{user.email}</strong>
            </p> */}
            <button onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <p>Please sign in to access your dashboard.</p>
        )}
      </div>
    </div>
  );
}

export default Intheader;
