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

  const stepClass = (done, active) => done ? 'tl-done' : active ? 'tl-active' : 'tl-pending';

  return (
    <div className="student-dashboard">

      {/* ── HERO BANNER ── */}
      <div className="dashboard-hero">
        <div className="hero-inner">
          <div className="hero-greeting">
            <p className="eyebrow">Student Dashboard</p>
            <h1>Hello, <span>{studentData?.name || 'Student'}</span> 👋</h1>
            <p className="subtitle">Your career & college journey — track every step.</p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-val">{completedSteps}/{steps.length}</span>
              <span className="stat-lbl">Steps Done</span>
            </div>
            <div className="hero-stat">
              <span className="stat-val">{studentData?.cgpa || '—'}</span>
              <span className="stat-lbl">CGPA</span>
            </div>
            <div className="hero-stat">
              <span className="stat-val">{hasAppearedForTest ? `${Math.round(studentData.aptitudeScore)}%` : '—'}</span>
              <span className="stat-lbl">Aptitude</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING BODY ── */}
      <div className="dashboard-body">

        {/* ── STATS CARDS ── */}
        <div className="dashboard-grid">

          {/* Profile */}
          <div className="dash-card accent-blue">
            <div className="card-top">
              <div className="card-icon-box icon-blue"><UsersIcon size={18} /></div>
              <span className={`card-status-dot ${profileComplete ? 'dot-green' : 'dot-amber'}`}></span>
            </div>
            <h3>Profile</h3>
            <div className={`card-value ${profileComplete ? 'text-green' : 'text-amber'}`}>
              {profileComplete ? 'Complete' : 'Pending'}
            </div>
            <p className="card-sub">{profileComplete ? 'All details filled in' : 'Add CGPA & personal info'}</p>
            <button className={`dash-btn ${profileComplete ? 'dash-btn-outline' : 'dash-btn-primary'} dash-btn-sm`}
              onClick={() => navigate('/student-details')}>
              {profileComplete ? 'Update' : 'Complete Now'}
            </button>
          </div>

          {/* Academic */}
          <div className="dash-card accent-purple">
            <div className="card-top">
              <div className="card-icon-box icon-purple"><ChartIcon size={18} /></div>
              <span className={`card-status-dot ${studentData?.cgpa ? 'dot-purple' : 'dot-amber'}`}></span>
            </div>
            <h3>Academics</h3>
            <div className="scores-row">
              <div className="score-chip">
                <span className="sc-val">{studentData?.cgpa || '—'}</span>
                <span className="sc-lbl">CGPA</span>
              </div>
              <div className="score-chip">
                <span className="sc-val">{hasAppearedForTest ? `${Math.round(studentData.aptitudeScore)}%` : '—'}</span>
                <span className="sc-lbl">Aptitude</span>
              </div>
            </div>
          </div>

          {/* Colleges */}
          <div className="dash-card accent-green">
            <div className="card-top">
              <div className="card-icon-box icon-green"><BuildingIcon size={18} /></div>
              <span className="card-status-dot dot-green"></span>
            </div>
            <h3>Find Colleges</h3>
            <div className="card-value text-green">Browse</div>
            <p className="card-sub">Colleges matched to your profile &amp; career</p>
            <button className="dash-btn dash-btn-green dash-btn-sm" onClick={() => navigate('/college-list')}>
              View Colleges →
            </button>
          </div>

          {/* Applications */}
          <div className="dash-card accent-amber">
            <div className="card-top">
              <div className="card-icon-box icon-amber"><DocumentIcon size={18} /></div>
              <span className="card-status-dot dot-amber"></span>
            </div>
            <h3>Applications</h3>
            <div className="card-value text-amber">Track</div>
            <p className="card-sub">Monitor your college application status</p>
            <button className="dash-btn dash-btn-outline dash-btn-sm" onClick={() => navigate('/applications')}>
              View Applications
            </button>
          </div>
        </div>

        {/* ── PROGRESS TRACKER ── */}
        <div className="progress-card">
          <div className="progress-card-header">
            <h2>Onboarding Progress</h2>
            <span className={`progress-pill ${completedSteps === steps.length ? 'complete' : ''}`}>
              {completedSteps === steps.length ? '✓ All Done' : `${completedSteps} / ${steps.length} steps`}
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-meta">
              <span>Progress</span>
              <strong>{Math.round(progressPercent)}%</strong>
            </div>
            <div className="pbar-bg">
              <div className="pbar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="steps-timeline">

            {/* Step 1 */}
            <div className={`timeline-step ${stepClass(profileComplete, completedSteps === 0)}`}>
              <div className="step-node-wrap">
                <div className="step-node">
                  {profileComplete ? <CheckIcon size={14} color="#fff" /> : '1'}
                </div>
              </div>
              <div className="step-body">
                <div className="step-row">
                  <div className="step-info">
                    <div className="step-label">
                      <h4>Complete Your Profile</h4>
                      {profileComplete && <span className="step-tag tag-done">Done</span>}
                      {!profileComplete && completedSteps === 0 && <span className="step-tag tag-active">Active</span>}
                    </div>
                    <p>{profileComplete ? 'Profile completed with CGPA and personal details' : 'Add your CGPA, exam scores, and personal details'}</p>
                  </div>
                  {!profileComplete && (
                    <div className="step-actions">
                      <button className="dash-btn dash-btn-primary dash-btn-sm" onClick={() => navigate('/student-details')}>
                        Complete Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`timeline-step ${stepClass(hasCareer, profileComplete && !hasCareer)}`}>
              <div className="step-node-wrap">
                <div className="step-node">
                  {hasCareer ? <CheckIcon size={14} color="#fff" /> : '2'}
                </div>
              </div>
              <div className="step-body">
                <div className="step-row">
                  <div className="step-info">
                    <div className="step-label">
                      <h4>Choose Your Career Path</h4>
                      {hasCareer && <span className="step-tag tag-done">Done</span>}
                      {!hasCareer && profileComplete && <span className="step-tag tag-active">Active</span>}
                    </div>
                    <p>{hasCareer ? `Selected: ${studentData.preferences.career}` : 'Explore career fields and pick one that fits you'}</p>
                  </div>
                  <div className="step-actions">
                    <button className={`dash-btn ${hasCareer ? 'dash-btn-outline' : 'dash-btn-primary'} dash-btn-sm`}
                      onClick={() => navigate('/career-selection')}>
                      {hasCareer ? 'Change' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`timeline-step ${stepClass(hasLocation, hasCareer && !hasLocation)}`}>
              <div className="step-node-wrap">
                <div className="step-node">
                  {hasLocation ? <CheckIcon size={14} color="#fff" /> : '3'}
                </div>
              </div>
              <div className="step-body">
                <div className="step-row">
                  <div className="step-info">
                    <div className="step-label">
                      <h4>Pick Study Location</h4>
                      {hasLocation && <span className="step-tag tag-done">Done</span>}
                      {!hasLocation && hasCareer && <span className="step-tag tag-active">Active</span>}
                    </div>
                    <p>{hasLocation ? `Selected: ${studentData.preferences.location}` : 'Choose to study in India or abroad'}</p>
                  </div>
                  <div className="step-actions">
                    <button className={`dash-btn ${hasLocation ? 'dash-btn-outline' : 'dash-btn-primary'} dash-btn-sm`}
                      onClick={() => navigate('/location-selection')}>
                      {hasLocation ? 'Change' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`timeline-step ${stepClass(hasAppearedForTest, hasLocation && !hasAppearedForTest)}`}>
              <div className="step-node-wrap">
                <div className="step-node">
                  {hasAppearedForTest ? <CheckIcon size={14} color="#fff" /> : '4'}
                </div>
              </div>
              <div className="step-body">
                <div className="step-row">
                  <div className="step-info">
                    <div className="step-label">
                      <h4>Take Aptitude Test</h4>
                      {hasAppearedForTest && <span className="step-tag tag-done">Done</span>}
                      {!hasAppearedForTest && hasLocation && <span className="step-tag tag-active">Active</span>}
                    </div>
                    <p>{hasAppearedForTest ? `Score: ${Math.round(studentData.aptitudeScore)}% — test completed` : '30-minute assessment to gauge your strengths'}</p>
                  </div>
                  <div className="step-actions">
                    {hasAppearedForTest ? (
                      <>
                        <button className="dash-btn dash-btn-outline dash-btn-sm" onClick={() => navigate('/test-completion')}>
                          Result
                        </button>
                        <button className="dash-btn dash-btn-purple dash-btn-sm" onClick={() => navigate('/aptitude-test')}>
                          Retake
                        </button>
                      </>
                    ) : (
                      <button className="dash-btn dash-btn-primary dash-btn-sm"
                        onClick={() => navigate('/aptitude-test')} disabled={!profileComplete}>
                        {profileComplete ? 'Start Test' : 'Complete Profile First'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="quick-actions">
          <div className="qa-card" onClick={() => navigate('/career-roadmap')}>
            <div className="qa-icon icon-blue"><GraduationCapIcon size={20} /></div>
            <div className="qa-text">
              <h4>Career Roadmap</h4>
              <p>View your personalised career path</p>
            </div>
            <span className="qa-arrow">›</span>
          </div>
          <div className="qa-card" onClick={() => navigate('/college-list')}>
            <div className="qa-icon icon-green"><BuildingIcon size={20} /></div>
            <div className="qa-text">
              <h4>Browse Colleges</h4>
              <p>Explore colleges matching your profile</p>
            </div>
            <span className="qa-arrow">›</span>
          </div>
          <div className="qa-card" onClick={() => navigate('/applications')}>
            <div className="qa-icon icon-amber"><FileTextIcon size={20} /></div>
            <div className="qa-text">
              <h4>My Applications</h4>
              <p>Track all your college applications</p>
            </div>
            <span className="qa-arrow">›</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;
