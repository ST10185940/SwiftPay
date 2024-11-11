import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>LOGO</h1>
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