// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const form = useState({
    username: "",
    password: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const newLogin = {...form};

    const rsp = await fetch("https://localhost:3001/bankEmp/login/",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newLogin)
    })
    .catch(error =>{
        window.alert(error);
        return;
    });

    if (rsp.message === "Successful") {
      setIsSuccess(true);
      setMessage('Login successful! Loading Workspace...');

      const token = rsp.token;
      sessionStorage.setItem('token', token);

      navigate('/dashboard/verify');
      setTimeout(() => {
        window.location.href = '/';  
      }, 2000);
    } else {
      setIsSuccess(false);
      setMessage(rsp.message);
    }
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="logo-container">
        <h1 className="logo">LOGO</h1>
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