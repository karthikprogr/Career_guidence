import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { logInfo } from '../logger';
import './Navbar.css';

function Navbar({ user, userRole }) {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Left: Brand */}
          <Link to="/" className="navbar-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            CareerGuide
          </Link>

          {/* Mobile toggle — desktop/tablet only */}
          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          {/* Center: Pill nav links */}
          <div className={`navbar-pill ${menuOpen ? 'open' : ''}`}>
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
                    <Link to="/aptitude-test" className="nav-link" onClick={() => setMenuOpen(false)}>Aptitude Test</Link>
                    <Link to="/student-details" className="nav-link" onClick={() => setMenuOpen(false)}>Profile</Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              </>
            )}
          </div>

          {/* Right: CTA button */}
          <div className="navbar-cta">
            {user ? (
              <button onClick={handleLogout} className="btn-cta">Logout</button>
            ) : (
              <Link to="/signup" className="btn-cta" onClick={() => setMenuOpen(false)}>Get Started</Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── BOTTOM NAV (mobile only, student) ── */}
      {user && userRole === 'student' && (
        <nav className="bottom-nav">
          <Link to="/student" className={`bnav-item ${isActive('/student') ? 'bnav-active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </Link>
          <Link to="/career-roadmap" className={`bnav-item ${isActive('/career-roadmap') ? 'bnav-active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>Roadmap</span>
          </Link>
          <Link to="/college-list" className={`bnav-item ${isActive('/college-list') ? 'bnav-active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <line x1="12" y1="12" x2="12" y2="16"/>
              <line x1="10" y1="14" x2="14" y2="14"/>
            </svg>
            <span>Colleges</span>
          </Link>
          <Link to="/aptitude-test" className={`bnav-item ${isActive('/aptitude-test') ? 'bnav-active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <span>Test</span>
          </Link>
          <Link to="/student-details" className={`bnav-item ${isActive('/student-details') ? 'bnav-active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </Link>
          <button className="bnav-item bnav-logout" onClick={handleLogout}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        </nav>
      )}
    </>
  );
}

export default Navbar;
