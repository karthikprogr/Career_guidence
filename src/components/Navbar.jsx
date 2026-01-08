import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { logInfo } from '../logger';
import './Navbar.css';

function Navbar({ user, userRole }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logInfo('AUTH', 'User logged out', { userId: user?.uid });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          🎓 Career Guidance
        </Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              {userRole === 'admin' && (
                <Link to="/admin" className="nav-link">Dashboard</Link>
              )}
              {userRole === 'student' && (
                <>
                  <Link to="/student" className="nav-link">Dashboard</Link>
                  <Link to="/college-list" className="nav-link">Colleges</Link>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
