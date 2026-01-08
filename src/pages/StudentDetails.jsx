import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logSuccess, logError } from '../logger';
import './StudentDetails.css';

function StudentDetails() {
  const [formData, setFormData] = useState({
    cgpa: '',
    examScores: {
      jee: '',
      neet: '',
      cat: '',
      gmat: '',
      other: ''
    },
    phoneNumber: '',
    dateOfBirth: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const studentDoc = await getDoc(doc(db, 'students', auth.currentUser.uid));
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        setFormData({
          cgpa: data.cgpa || '',
          examScores: data.examScores || {
            jee: '',
            neet: '',
            cat: '',
            gmat: '',
            other: ''
          },
          phoneNumber: data.phoneNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          address: data.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('exam_')) {
      const examName = name.replace('exam_', '');
      setFormData({
        ...formData,
        examScores: {
          ...formData.examScores,
          [examName]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDoc(doc(db, 'students', auth.currentUser.uid), {
        cgpa: parseFloat(formData.cgpa) || 0,
        examScores: formData.examScores,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        profileCompleted: true,
        updatedAt: serverTimestamp()
      });

      logSuccess('STUDENT', 'Profile updated successfully');
      navigate('/student');
    } catch (error) {
      logError('STUDENT', 'Failed to update profile', { error: error.message });
      alert('Failed to save details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  return (
    <div className="student-details-page">
      <div className="container">
        <div className="details-header">
          <h1>Complete Your Profile</h1>
          <p>Provide your academic and personal details</p>
        </div>

        <div className="details-card">
          <form onSubmit={handleSubmit}>
            {/* Academic Information */}
            <div className="form-section">
              <h2>📚 Academic Information</h2>
              
              <div className="form-group">
                <label className="form-label">CGPA / Percentage *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g., 8.5 or 85"
                  required
                />
                <small>Enter CGPA (out of 10) or Percentage</small>
              </div>

              <h3>Entrance Exam Scores (Optional)</h3>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">JEE Score</label>
                  <input
                    type="text"
                    className="form-input"
                    name="exam_jee"
                    value={formData.examScores.jee}
                    onChange={handleChange}
                    placeholder="e.g., 95 percentile"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">NEET Score</label>
                  <input
                    type="text"
                    className="form-input"
                    name="exam_neet"
                    value={formData.examScores.neet}
                    onChange={handleChange}
                    placeholder="e.g., 600/720"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CAT Score</label>
                  <input
                    type="text"
                    className="form-input"
                    name="exam_cat"
                    value={formData.examScores.cat}
                    onChange={handleChange}
                    placeholder="e.g., 98 percentile"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GMAT Score</label>
                  <input
                    type="text"
                    className="form-input"
                    name="exam_gmat"
                    value={formData.examScores.gmat}
                    onChange={handleChange}
                    placeholder="e.g., 700/800"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Other Exam</label>
                  <input
                    type="text"
                    className="form-input"
                    name="exam_other"
                    value={formData.examScores.other}
                    onChange={handleChange}
                    placeholder="Specify exam and score"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="form-section">
              <h2>👤 Personal Information</h2>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 1234567890"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    className="form-input"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea
                  className="form-textarea"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your full address"
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/student')}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
