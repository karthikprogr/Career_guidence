import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo } from '../logger';
import { 
  LocationIcon, 
  CheckIcon, 
  MoneyIcon, 
  GraduationCapIcon, 
  ChartIcon, 
  BuildingIcon,
  FileTextIcon
} from '../components/Icons';
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
            <div className="header-content">
              <h1>{college.name}</h1>
              <p className="college-location">
                <LocationIcon size={20} /> 
                {college.city && college.state ? 
                  `${college.city}, ${college.state}, ${college.country || 'India'}` : 
                  college.location || 'Location not specified'
                }
              </p>
              {college.type && (
                <p className="college-type">
                  <BuildingIcon size={18} /> {college.type}
                </p>
              )}
            </div>
            <div className="college-rank">
              <span>Rank</span>
              <strong>#{college.ranking || 'N/A'}</strong>
            </div>
          </div>

          {/* Eligibility Status */}
          {studentData && (
            <div className={`eligibility-banner ${isEligible ? 'eligible' : 'not-eligible'}`}>
              {isEligible ? (
                <>
                  <span className="status-icon"><CheckIcon size={20} /></span>
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
              <div className="info-icon"><MoneyIcon size={32} /></div>
              <div>
                <p className="info-label">Annual Fees</p>
                <p className="info-value">
                  {college.fees ? (() => { const s={INR:'₹',USD:'$',GBP:'£',EUR:'€',AUD:'A$',CAD:'C$',SGD:'S$',CHF:'CHF ',SEK:'kr '}; return `${s[college.currency||'INR']||((college.currency||'INR')+' ')}${college.fees.toLocaleString()}`; })() : 'Not Available'}
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><GraduationCapIcon size={32} /></div>
              <div>
                <p className="info-label">Type</p>
                <p className="info-value">{college.type || 'Not specified'}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><ChartIcon size={32} /></div>
              <div>
                <p className="info-label">Min CGPA</p>
                <p className="info-value">{college.minCGPA || 'N/A'}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><BuildingIcon size={32} /></div>
              <div>
                <p className="info-label">Placement Rate</p>
                <p className="info-value">{college.placementRate || 'N/A'}%</p>
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
              <h2><BuildingIcon size={24} /> Facilities</h2>
              <p>{college.facilities}</p>
            </div>
          )}

          {/* Scholarships */}
          {college.scholarships && (
            <div className="college-section">
              <h2><GraduationCapIcon size={24} /> Scholarships</h2>
              <p>{college.scholarships}</p>
            </div>
          )}

          {/* Contact Information */}
          {(college.contact || college.email || college.website) && (
            <div className="college-section">
              <h2>Contact Information</h2>
              <div className="contact-info">
                {college.contact && (
                  <p><strong>Phone:</strong> {college.contact}</p>
                )}
                {college.email && (
                  <p><strong>Email:</strong> <a href={`mailto:${college.email}`}>{college.email}</a></p>
                )}
                {college.website && (
                  <p><strong>Website:</strong> <a href={college.website} target="_blank" rel="noopener noreferrer">{college.website}</a></p>
                )}
                {college.address && (
                  <p><strong>Address:</strong> {college.address}</p>
                )}
              </div>
            </div>
          )}

          {/* Registration Process */}
          <div className="college-section registration-section">
            <h2><FileTextIcon size={24} /> Registration Process</h2>
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
            ) : !isEligible ? (
              <div className="alert alert-warning">
                Your CGPA does not meet the eligibility criteria for this college.
              </div>
            ) : (
              <button 
                className="btn btn-success btn-large"
                onClick={() => navigate(`/college-apply/${college.id}`)}
                style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
              >
                <FileTextIcon size={20} /> Apply Now
              </button>
            )}
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/applications')}
              style={{ marginTop: '1rem' }}
            >
              View My Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeDetails;
