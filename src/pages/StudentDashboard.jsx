import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo } from '../logger';
import { 
  GraduationCapIcon, 
  FileTextIcon, 
  LocationIcon, 
  ChartIcon, 
  DocumentIcon, 
  CheckIcon,
  UsersIcon,
  BuildingIcon
} from '../components/Icons';
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
  const hasCareer = !!studentData?.preferences?.career;
  const hasLocation = !!studentData?.preferences?.location;
  const hasAppearedForTest = studentData?.aptitudeScore > 0;

  // Calculate progress
  const steps = [profileComplete, hasCareer, hasLocation, hasAppearedForTest];
  const completedSteps = steps.filter(Boolean).length;
  const progressPercent = (completedSteps / steps.length) * 100;

  return (
    <div className="student-dashboard">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome, {studentData?.name || 'Student'}!</h1>
          <p>Your journey to the perfect career and college starts here</p>
        </div>

        {/* Progress Tracker */}
        <div className="progress-tracker-card">
          <div className="progress-header">
            <h2>Your Progress</h2>
            <span className="progress-badge">{completedSteps} of {steps.length} steps completed</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="journey-steps">
            {/* Step 1: Complete Profile */}
            <div className={`journey-step ${profileComplete ? 'completed' : completedSteps === 0 ? 'current' : 'pending'}`}>
              <div className="step-indicator">
                {profileComplete ? <CheckIcon size={18} color="#ffffff" /> : <span>1</span>}
              </div>
              <div className="step-content">
                <h4>Complete Your Profile</h4>
                <p>Add your CGPA, exam scores, and personal details</p>
                {!profileComplete && (
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/student-details')}>
                    Complete Now
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: Choose Career */}
            <div className={`journey-step ${hasCareer ? 'completed' : profileComplete && !hasCareer ? 'current' : 'pending'}`}>
              <div className="step-indicator">
                {hasCareer ? <CheckIcon size={18} color="#ffffff" /> : <span>2</span>}
              </div>
              <div className="step-content">
                <h4>Choose Your Career Path</h4>
                <p>{hasCareer ? `Selected: ${studentData.preferences.career}` : 'Explore 6 career fields and pick one'}</p>
                <button 
                  className={`btn ${hasCareer ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  onClick={() => navigate('/career-selection')}
                >
                  {hasCareer ? 'Change Career' : 'Select Career'}
                </button>
              </div>
            </div>

            {/* Step 3: Pick Location */}
            <div className={`journey-step ${hasLocation ? 'completed' : hasCareer && !hasLocation ? 'current' : 'pending'}`}>
              <div className="step-indicator">
                {hasLocation ? <CheckIcon size={18} color="#ffffff" /> : <span>3</span>}
              </div>
              <div className="step-content">
                <h4>Pick Study Location</h4>
                <p>{hasLocation ? `Selected: ${studentData.preferences.location}` : 'Choose India or Abroad'}</p>
                <button 
                  className={`btn ${hasLocation ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  onClick={() => navigate('/location-selection')}
                >
                  {hasLocation ? 'Change Location' : 'Select Location'}
                </button>
              </div>
            </div>

            {/* Step 4: Take Test */}
            <div className={`journey-step ${hasAppearedForTest ? 'completed' : hasLocation && !hasAppearedForTest ? 'current' : 'pending'}`}>
              <div className="step-indicator">
                {hasAppearedForTest ? <CheckIcon size={18} color="#ffffff" /> : <span>4</span>}
              </div>
              <div className="step-content">
                <h4>Take Aptitude Test</h4>
                <p>{hasAppearedForTest ? `Score: ${Math.round(studentData.aptitudeScore)}%` : '30-minute test to assess your strengths'}</p>
                {hasAppearedForTest ? (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/test-completion')}>
                      View Result
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/aptitude-test')}>
                      Retake Test
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/aptitude-test')}
                    disabled={!profileComplete}
                  >
                    {profileComplete ? 'Start Test' : 'Complete Profile First'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="dashboard-grid">
          {/* Profile Status */}
          <div className="dashboard-card">
            <div className="card-icon"><UsersIcon size={28} /></div>
            <h3>Profile Status</h3>
            <p className={profileComplete ? 'status-complete' : 'status-incomplete'}>
              {profileComplete ? 'Complete' : 'Incomplete'}
            </p>
            <button 
              className={`btn ${profileComplete ? 'btn-outline' : 'btn-primary'} btn-sm`}
              onClick={() => navigate('/student-details')}
            >
              {profileComplete ? 'Update Profile' : 'Complete Profile'}
            </button>
          </div>

          {/* Academic Score */}
          <div className="dashboard-card">
            <div className="card-icon"><ChartIcon size={28} /></div>
            <h3>Academic Score</h3>
            <p className="score-display">{studentData?.cgpa ? `CGPA: ${studentData.cgpa}` : 'Not Added'}</p>
            {studentData?.aptitudeScore > 0 && (
              <p className="score-display aptitude-score">Aptitude: {Math.round(studentData.aptitudeScore)}%</p>
            )}
          </div>

          {/* Find Colleges */}
          <div className="dashboard-card highlight-card">
            <div className="card-icon"><BuildingIcon size={28} /></div>
            <h3>Find Colleges</h3>
            <p>Browse colleges matching your profile and preferences</p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/college-list')}
            >
              View Colleges
            </button>
          </div>

          {/* My Applications */}
          <div className="dashboard-card">
            <div className="card-icon"><DocumentIcon size={28} /></div>
            <h3>My Applications</h3>
            <p>Track your college application status</p>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/applications')}
            >
              View Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
