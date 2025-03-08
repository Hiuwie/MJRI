import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig'; // Update the path if needed

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // Optional: You can add a loading spinner here while Firebase checks the auth state.
    return <p>Loading...</p>;
  }

  if (!user) {
    // If the user is not logged in, redirect to the login page.
    return <Navigate to="/Signin" />;
  }

  // If the user is authenticated, render the child component.
  return children;
}

export default ProtectedRoute;
