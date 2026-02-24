import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo, logError, logSuccess } from '../logger';
import { CheckIcon, CloseIcon } from '../components/Icons';
import './CollegeApplication.css';

function CollegeApplication() {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [applicationForm, setApplicationForm] = useState({
    fatherName: '',
    motherName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    alternatePhone: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    graduationCGPA: '',
    preferredCourse: '',
    remarks: ''
  });

  useEffect(() => {
    fetchData();
  }, [collegeId]);

  const fetchData = async () => {
    try {
      // Fetch college details
      const collegeDoc = await getDoc(doc(db, 'colleges', collegeId));
      if (collegeDoc.exists()) {
        setCollege({ id: collegeDoc.id, ...collegeDoc.data() });
      }

      // Fetch student data
      const studentDoc = await getDoc(doc(db, 'students', auth.currentUser.uid));
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        setStudentData(data);
        
        // Pre-fill form with existing data
        setApplicationForm(prev => ({
          ...prev,
          graduationCGPA: data.cgpa || '',
          phone: data.phone || '',
          preferredCourse: data.preferences?.career || ''
        }));
      }

      // Fetch test results
      const testDoc = await getDoc(doc(db, 'testResults', auth.currentUser.uid));
      if (testDoc.exists()) {
        setTestResults(testDoc.data());
      }

      logInfo('STUDENT', 'Application page data fetched', { collegeId });
    } catch (error) {
      logError('STUDENT', 'Failed to fetch application data', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setApplicationForm({
      ...applicationForm,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const required = ['fatherName', 'motherName', 'address', 'city', 'state', 'pincode', 'phone', 'tenthPercentage', 'twelfthPercentage', 'graduationCGPA', 'preferredCourse'];
    
    for (let field of required) {
      if (!applicationForm[field]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Check eligibility
    if (studentData?.cgpa < college?.minCGPA) {
      alert(`Your CGPA (${studentData.cgpa}) does not meet the minimum requirement (${college.minCGPA})`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const applicationData = {
        studentId: auth.currentUser.uid,
        studentName: studentData.name,
        studentEmail: auth.currentUser.email,
        collegeId: college.id,
        collegeName: college.name,
        ...applicationForm,
        cgpa: studentData.cgpa,
        testScore: testResults?.score || 0,
        status: 'pending',
        appliedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'applications'), applicationData);
      
      logSuccess('STUDENT', 'Application submitted successfully', { 
        collegeId: college.id,
        collegeName: college.name 
      });
      
      alert('Application submitted successfully! We will notify you once the college reviews your application.');
      navigate('/student');
    } catch (error) {
      logError('STUDENT', 'Failed to submit application', { error: error.message });
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  if (!college) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>College not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/college-list')}>
          Back to College List
        </button>
      </div>
    );
  }

  const isEligible = studentData?.cgpa >= college.minCGPA;

  return (
    <div className="college-application-page">
      <div className="container">
        <div className="page-header">
          <h1>College Application</h1>
          <p>Fill in the details to apply to {college.name}</p>
        </div>

        {/* College Info Card */}
        <div className="college-info-card">
          <h2>{college.name}</h2>
          <div className="college-details">
            <p><strong>Location:</strong> {college.location}</p>
            <p><strong>Type:</strong> {college.type}</p>
            <p><strong>Fees:</strong> ₹{college.fees?.toLocaleString()}/year</p>
            <p><strong>Ranking:</strong> #{college.ranking}</p>
            <p><strong>Min CGPA Required:</strong> {college.minCGPA}</p>
            <p><strong>Placement Rate:</strong> {college.placementRate}%</p>
          </div>
        </div>

        {/* Eligibility Check */}
        <div className={`eligibility-banner ${isEligible ? 'eligible' : 'not-eligible'}`}>
          {isEligible ? (
            <>
              <span className="status-icon"><CheckIcon size={24} /></span>
              <div>
                <h3>You are eligible to apply!</h3>
                <p>Your CGPA ({studentData.cgpa}) meets the minimum requirement ({college.minCGPA})</p>
              </div>
            </>
          ) : (
            <>
              <span className="status-icon"><CloseIcon size={24} /></span>
              <div>
                <h3>You do not meet the eligibility criteria</h3>
                <p>Your CGPA ({studentData?.cgpa || 'N/A'}) is below the minimum requirement ({college.minCGPA})</p>
              </div>
            </>
          )}
        </div>

        {/* Test Score Info */}
        {testResults && (
          <div className="test-score-info">
            <h3>Your Aptitude Test Score</h3>
            <div className="score-display">
              <span className="score">{testResults.score}%</span>
              <span className="score-label">Overall Score</span>
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="application-form-card">
          <h2>Application Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Student Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentData?.name || ''}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={auth.currentUser.email}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Father's Name *</label>
                  <input
                    type="text"
                    name="fatherName"
                    className="form-input"
                    value={applicationForm.fatherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mother's Name *</label>
                  <input
                    type="text"
                    name="motherName"
                    className="form-input"
                    value={applicationForm.motherName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={applicationForm.phone}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Alternate Phone</label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    className="form-input"
                    value={applicationForm.alternatePhone}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Address Details</h3>
              <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea
                  name="address"
                  className="form-textarea"
                  rows="2"
                  value={applicationForm.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={applicationForm.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    className="form-input"
                    value={applicationForm.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-input"
                    value={applicationForm.pincode}
                    onChange={handleInputChange}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Academic Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">10th Percentage *</label>
                  <input
                    type="number"
                    name="tenthPercentage"
                    className="form-input"
                    value={applicationForm.tenthPercentage}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">12th Percentage *</label>
                  <input
                    type="number"
                    name="twelfthPercentage"
                    className="form-input"
                    value={applicationForm.twelfthPercentage}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Graduation CGPA *</label>
                  <input
                    type="number"
                    name="graduationCGPA"
                    className="form-input"
                    value={applicationForm.graduationCGPA}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Course *</label>
                  <input
                    type="text"
                    name="preferredCourse"
                    className="form-input"
                    value={applicationForm.preferredCourse}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label className="form-label">Remarks (Optional)</label>
                <textarea
                  name="remarks"
                  className="form-textarea"
                  rows="3"
                  placeholder="Any additional information you would like to share..."
                  value={applicationForm.remarks}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={!isEligible || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CollegeApplication;
