import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { logInfo } from '../logger';
import './Navbar.css';

function Navbar({ user, userRole }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logInfo('AUTH', 'User logged out', { userId: user?.uid });
      setMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          Career Guidance
        </Link>
        
        {/* Mobile toggle */}
        <button 
          className="navbar-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </>
            )}
          </svg>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              {userRole === 'admin' && (
                <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              )}
              {userRole === 'student' && (
                <>
                  <Link to="/student" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/career-roadmap" className="nav-link" onClick={() => setMenuOpen(false)}>Career Roadmap</Link>
                  <Link to="/college-list" className="nav-link" onClick={() => setMenuOpen(false)}>Colleges</Link>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-primary btn-nav">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn btn-primary btn-nav" onClick={() => setMenuOpen(false)}>Sign Up Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
