import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo } from '../logger';
import './CollegeDetails.css';

function CollegeDetails() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  const fetchCollegeDetails = async () => {
    try {
      // Fetch college
      const collegeDoc = await getDoc(doc(db, 'colleges', id));
      if (collegeDoc.exists()) {
        setCollege({ id: collegeDoc.id, ...collegeDoc.data() });
        logInfo('STUDENT', 'College details viewed', { collegeId: id });
      }

      // Fetch student data
      const studentDoc = await getDoc(doc(db, 'students', auth.currentUser.uid));
      if (studentDoc.exists()) {
        setStudentData(studentDoc.data());
      }
    } catch (error) {
      console.error('Error fetching college details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  if (!college) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>College not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/college-list')}>
          Back to List
        </button>
      </div>
    );
  }

  const isEligible = studentData?.cgpa >= college.minCGPA;

  return (
    <div className="college-details-page">
      <div className="container">
        <button className="btn btn-secondary back-btn" onClick={() => navigate('/college-list')}>
          ← Back to List
        </button>

        <div className="college-details-card">
          <div className="college-header">
            <div>
              <h1>{college.name}</h1>
              <p className="college-location">📍 {college.location}</p>
            </div>
            <div className="college-rank">
              <span>Rank</span>
              <strong>#{college.ranking}</strong>
            </div>
          </div>

          {/* Eligibility Status */}
          {studentData && (
            <div className={`eligibility-banner ${isEligible ? 'eligible' : 'not-eligible'}`}>
              {isEligible ? (
                <>
                  <span className="status-icon">✓</span>
                  <span>You are eligible for this college</span>
                </>
              ) : (
                <>
                  <span className="status-icon">⚠</span>
                  <span>Your CGPA ({studentData.cgpa}) is below the minimum requirement ({college.minCGPA})</span>
                </>
              )}
            </div>
          )}

          {/* Quick Info */}
          <div className="quick-info-grid">
            <div className="info-card">
              <div className="info-icon">💰</div>
              <div>
                <p className="info-label">Annual Fees</p>
                <p className="info-value">₹{college.fees.toLocaleString()}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🎓</div>
              <div>
                <p className="info-label">Type</p>
                <p className="info-value">{college.type}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📊</div>
              <div>
                <p className="info-label">Min CGPA</p>
                <p className="info-value">{college.minCGPA}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">💼</div>
              <div>
                <p className="info-label">Placement Rate</p>
                <p className="info-value">{college.placementRate}%</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {college.description && (
            <div className="college-section">
              <h2>About</h2>
              <p>{college.description}</p>
            </div>
          )}

          {/* Facilities */}
          {college.facilities && (
            <div className="college-section">
              <h2>🏢 Facilities</h2>
              <p>{college.facilities}</p>
            </div>
          )}

          {/* Scholarships */}
          {college.scholarships && (
            <div className="college-section">
              <h2>🎓 Scholarships</h2>
              <p>{college.scholarships}</p>
            </div>
          )}

          {/* Registration Process */}
          <div className="college-section registration-section">
            <h2>📝 Registration Process</h2>
            <ol>
              <li>Complete your student profile with all required details</li>
              <li>Take the aptitude test to demonstrate your skills</li>
              <li>Ensure you meet the minimum CGPA requirement</li>
              <li>Review the college's eligibility criteria and facilities</li>
              <li>Contact the college directly for application procedures</li>
            </ol>
            
            {studentData && !studentData.profileCompleted && (
              <div className="alert alert-warning">
                Please complete your profile before applying
              </div>
            )}
            
            {studentData && studentData.aptitudeScore === 0 && (
              <div className="alert alert-warning">
                Complete the aptitude test to improve your application
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-section">
            {!studentData?.profileCompleted ? (
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/student-details')}
              >
                Complete Profile First
              </button>
            ) : studentData?.aptitudeScore === 0 ? (
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/aptitude-test')}
              >
                Take Aptitude Test
              </button>
            ) : (
              <div className="alert alert-success">
                ✓ You have completed all requirements. Contact the college for application.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeDetails;
