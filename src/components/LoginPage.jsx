// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../swiftpay-high-resolution-logo.png';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Creating the newLogin object from state values
    const newLogin = { username, password };

    try {
      const response = await fetch("https://localhost:3001/bankEmp/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLogin)
      });

      const rsp = await response.json();

      if (response.ok && rsp.message === "Successful") {
        setIsSuccess(true);
        setMessage('Login successful! Loading Workspace...');

        const token = rsp.token;
        sessionStorage.setItem('token', token);

        // Navigate to the verification page
        navigate('/dashboard/verify');
        setTimeout(() => navigate('/'), 2000); 
      } else {
        setIsSuccess(false);
        setMessage(rsp.message || "Login failed. Please try again.");
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
          <h2 className="welcome-text">SwiftPay Employee Login</h2>

          {/* Message display */}
          {message && (
            <div className={`message ${isSuccess ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit}>
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
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;