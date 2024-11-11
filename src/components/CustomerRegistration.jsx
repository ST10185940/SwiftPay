// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../swiftpay-high-resolution-logo.png';
import './LoginPage.css';

function CustomerRegistrationPage() {
  const [fullname, setFullName] = useState('');
  const [id_number, setId_Number] = useState('');
  const [account_number, setAccNUmber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Creating the newRegistration object from state values
    const newRegistration = { fullname, id_number, account_number, username, password };

    try {
      const response = await fetch("https://localhost:3001/customer/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRegistration)
      });

      const rsp = await response.json();

      if (response.ok && rsp.message === "Success") {
        setIsSuccess(true);
        setMessage('Registration successful! Please login.');

        // Navigate to the login page 
        navigate('/customerLogin');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setIsSuccess(false);
        setMessage(rsp.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("An error occurred. Please try again.");
    }
  }

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="logo-container">
        <img src={logo} alt='swiftpay logo' className="logo"></img>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="login-box">
          <h2 className="welcome-text">SwiftPay customer Registration</h2>

          {/* Message display */}
          {message && (
            <div className={`message ${isSuccess ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit}>

          <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">ID Number</label>
              <input
                type="text"
                name="id_number"
                value={id_number}
                onChange={(e) => setId_Number(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                name="account_number"
                value={account_number}
                onChange={(e) => setAccNUmber(e.target.value)}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegistrationPage;