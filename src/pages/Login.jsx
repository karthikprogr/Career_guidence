import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { logInfo, logError, logSuccess } from '../logger';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      logInfo('AUTH', 'Login attempt started', { email });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        logInfo('AUTH', 'Login successful', { userId: user.uid, role });
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        throw new Error('User profile not found');
      }
    } catch (err) {
      logError('AUTH', 'Login failed', { email, error: err.message });
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        logInfo('AUTH', 'Google login successful', { userId: user.uid, role });
        
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        // Create new user with student role by default
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName || 'User',
          role: 'student',
          createdAt: new Date().toISOString()
        });
        
        logSuccess('AUTH', 'New user created via Google', { userId: user.uid });
        navigate('/student');
      }
    } catch (err) {
      logError('AUTH', 'Google sign-in failed', { error: err.message });
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    setError('');

    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      logSuccess('AUTH', 'Password reset email sent', { email: resetEmail });
      setResetMessage('Password reset email sent! Check your inbox and spam folder.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
        setResetEmail('');
      }, 5000);
    } catch (err) {
      logError('AUTH', 'Password reset failed', { email: resetEmail, error: err.message });
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Welcome back! Please login to your account.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="auth-links" style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
          <span style={{ background: 'white', padding: '0 1rem', position: 'relative', zIndex: 1, color: '#6B7280' }}>OR</span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#E5E7EB' }}></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          className="btn btn-google btn-block"
          disabled={loading}
          style={{
            background: 'white',
            color: '#344054',
            border: '1px solid #D0D5DD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button 
                className="modal-close"
                onClick={() => setShowForgotPassword(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <p style={{ marginBottom: '1rem', color: '#6B7280' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <p style={{ marginBottom: '1rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
                📧 <strong>Note:</strong> Please check your spam or junk folder if you don't see the email in your inbox.
              </p>

              {resetMessage && <div className="alert alert-success">{resetMessage}</div>}
              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
