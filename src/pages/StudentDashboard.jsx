import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo } from '../logger';
import './StudentDashboard.css';

function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const studentDoc = await getDoc(doc(db, 'students', auth.currentUser.uid));
      if (studentDoc.exists()) {
        setStudentData(studentDoc.data());
        logInfo('STUDENT', 'Student data fetched', { studentId: auth.currentUser.uid });
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  const profileComplete = studentData?.profileCompleted || false;
  const hasAppearedForTest = studentData?.aptitudeScore > 0;

  return (
    <div className="student-dashboard">
      <div className="container">
        <div className="welcome-section">
          <h1>Welcome, {studentData?.name}!</h1>
          <p>Your journey to the perfect college starts here</p>
        </div>

        <div className="dashboard-grid">
          {/* Profile Status */}
          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Profile Status</h3>
            <p className={profileComplete ? 'status-complete' : 'status-incomplete'}>
              {profileComplete ? '✓ Complete' : '⚠ Incomplete'}
            </p>
            {!profileComplete && (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/student-details')}
              >
                Complete Profile
              </button>
            )}
          </div>

          {/* Career Selection */}
          <div className="dashboard-card">
            <div className="card-icon">🎯</div>
            <h3>Career Preference</h3>
            <p>{studentData?.preferences?.career || 'Not Selected'}</p>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/career-selection')}
            >
              {studentData?.preferences?.career ? 'Change' : 'Select'}
            </button>
          </div>

          {/* Location Preference */}
          <div className="dashboard-card">
            <div className="card-icon">📍</div>
            <h3>Location Preference</h3>
            <p>{studentData?.preferences?.location || 'Not Selected'}</p>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/location-selection')}
            >
              {studentData?.preferences?.location ? 'Change' : 'Select'}
            </button>
          </div>

          {/* Aptitude Test */}
          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Aptitude Test</h3>
            {hasAppearedForTest ? (
              <>
                <p className="status-complete">Score: {studentData?.aptitudeScore}%</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/test-completion')}
                >
                  View Result
                </button>
              </>
            ) : (
              <>
                <p className="status-incomplete">Not Attempted</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/aptitude-test')}
                  disabled={!profileComplete}
                >
                  Start Test
                </button>
                {!profileComplete && (
                  <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--danger-color)' }}>
                    Complete your profile first
                  </small>
                )}
              </>
            )}
          </div>

          {/* CGPA */}
          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Academic Score</h3>
            <p>CGPA: {studentData?.cgpa || 'N/A'}</p>
          </div>

          {/* College List */}
          <div className="dashboard-card">
            <div className="card-icon">🏫</div>
            <h3>Find Colleges</h3>
            <p>Browse eligible colleges</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/college-list')}
            >
              View Colleges
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-btn"
              onClick={() => navigate('/career-selection')}
            >
              🎯 Select Career
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/location-selection')}
            >
              📍 Choose Location
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/student-details')}
            >
              📝 Update Details
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/college-list')}
            >
              🏫 Browse Colleges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
