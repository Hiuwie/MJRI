import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Update the path based on your folder structure
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import './internalStyle.css';
import Intfooter from './intfooter';
import Intheader from './intheader';

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      // alert("Login successful!");
      navigate("/ProducerAvailability"); // Redirect to the ProducerAvailability page
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName: name });

      // Save the user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
      });

      alert("Registration successful! Logging you in...");
      navigate("/ProducerAvailability"); // Redirect to the ProducerAvailability page
    } catch (err) {
      console.error("Error registering user:", err);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="Signin">
      <Intheader />
      <div className="login-area">
        <h2>{isRegistering ? "Register as a Producer" : "Sign in using your credentials"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <>
              <label htmlFor="name">Producer Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}
          <label htmlFor="Email">Email address</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            <p>{isRegistering ? "Register" : "Sign in"}</p>
          </button>
          <button onClick={() => setIsRegistering(!isRegistering)} className="sec-button">
          <p>{isRegistering ? "Already Registered? Sign in" : "New? Register Here"}</p>
        </button>
        </form>
       
      </div>
      <Intfooter />
    </div>
  );
}

export default Signin;
