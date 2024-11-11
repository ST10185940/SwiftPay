import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './swiftpay-high-resolution-logo.png';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo">
       <img src={logo} alt='swiftpay logo' className="logo" style={{height : 150}}></img>
      </div>
      
      <nav className="nav-menu">
        <button 
          className="nav-item"
          onClick={() => navigate('/dashboard/verify')}
        >
          Verify
        </button>
        
        <button 
          className="nav-item logout"
          onClick={() => navigate('/')}
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;