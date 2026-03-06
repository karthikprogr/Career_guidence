import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { db, auth } from '../firebase';
import { logSuccess, logError } from '../logger';
import './StudentDetails.css';

function StudentDetails() {
  const [formData, setFormData] = useState({
    displayName: '',
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
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password change state
  const [showPwdSection, setShowPwdSection] = useState(false);
  const [pwdData, setPwdData] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const isOnboarding = location.state?.from === 'onboarding';

  const currentUser = auth.currentUser;
  const initials = (() => {
    const name = formData.displayName || currentUser?.displayName || currentUser?.email || '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  })();

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const studentDoc = await getDoc(doc(db, 'students', currentUser.uid));
      const authName = currentUser?.displayName || '';
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        setFormData({
          displayName: data.displayName || authName,
          cgpa: data.cgpa || '',
          examScores: data.examScores || { jee: '', neet: '', cat: '', gmat: '', other: '' },
          phoneNumber: data.phoneNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          address: data.address || ''
        });
      } else {
        setFormData(prev => ({ ...prev, displayName: authName }));
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
      setFormData({ ...formData, examScores: { ...formData.examScores, [examName]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Update Firebase Auth display name
      if (formData.displayName && formData.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: formData.displayName });
      }

      await updateDoc(doc(db, 'students', currentUser.uid), {
        displayName: formData.displayName,
        cgpa: parseFloat(formData.cgpa) || 0,
        examScores: formData.examScores,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        profileCompleted: true,
        updatedAt: serverTimestamp()
      });

      logSuccess('STUDENT', 'Profile updated successfully');
      setSuccessMsg('Profile saved successfully!');
      setTimeout(() => {
        if (isOnboarding) navigate('/college-list');
        setSuccessMsg('');
      }, 2000);
    } catch (error) {
      logError('STUDENT', 'Failed to update profile', { error: error.message });
      setErrorMsg('Failed to save details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });
    if (pwdData.newPwd !== pwdData.confirm) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (pwdData.newPwd.length < 6) {
      setPwdMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setPwdLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, pwdData.current);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, pwdData.newPwd);
      setPwdMsg({ type: 'success', text: 'Password changed successfully!' });
      setPwdData({ current: '', newPwd: '', confirm: '' });
      setTimeout(() => { setPwdMsg({ type: '', text: '' }); setShowPwdSection(false); }, 3000);
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' ? 'Current password is incorrect.' : 'Failed to change password. Please try again.';
      setPwdMsg({ type: 'error', text: msg });
    } finally {
      setPwdLoading(false);
    }
  };

  if (fetching) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  return (
    <div className="student-details-page">
      <div className="container">

        {/* ── Profile Hero Header ── */}
        <div className="profile-hero">
          <div className="profile-avatar">
            <span className="profile-initials">{initials}</span>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-hero-name">
              {formData.displayName || currentUser?.displayName || 'Your Profile'}
            </h1>
            <p className="profile-hero-email">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {currentUser?.email}
            </p>
            <div className="profile-hero-badges">
              <span className="profile-badge student-badge">Student</span>
              {formData.cgpa ? <span className="profile-badge cgpa-badge">CGPA {formData.cgpa}</span> : null}
            </div>
          </div>
          <button
            className="profile-pwd-toggle"
            type="button"
            onClick={() => setShowPwdSection(!showPwdSection)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Change Password
          </button>
        </div>

        {/* ── Success / Error alerts ── */}
        {successMsg && (
          <div className="profile-alert profile-alert-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="profile-alert profile-alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {errorMsg}
          </div>
        )}

        {/* ── Change Password Section ── */}
        {showPwdSection && (
          <div className="details-card pwd-card">
            <div className="form-section">
              <div className="section-heading">
                <div className="section-icon pwd-icon">🔐</div>
                <div>
                  <h2>Change Password</h2>
                  <span>Update your account password</span>
                </div>
              </div>
              {pwdMsg.text && (
                <div className={`profile-alert ${pwdMsg.type === 'success' ? 'profile-alert-success' : 'profile-alert-error'}`}>
                  {pwdMsg.text}
                </div>
              )}
              <form onSubmit={handlePasswordChange}>
                <div className="sd-grid-2">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" value={pwdData.current}
                      onChange={e => setPwdData({...pwdData, current: e.target.value})}
                      placeholder="Enter current password" required />
                  </div>
                  <div></div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" value={pwdData.newPwd}
                      onChange={e => setPwdData({...pwdData, newPwd: e.target.value})}
                      placeholder="Min 6 characters" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-input" value={pwdData.confirm}
                      onChange={e => setPwdData({...pwdData, confirm: e.target.value})}
                      placeholder="Repeat new password" required />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => { setShowPwdSection(false); setPwdMsg({type:'',text:''}); }}>Cancel</button>
                  <button type="submit" className="btn-save" disabled={pwdLoading}>
                    {pwdLoading ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="details-card">
          <form onSubmit={handleSubmit}>

            {/* ── Identity ── */}
            <div className="form-section">
              <div className="section-heading">
                <div className="section-icon personal">👤</div>
                <div>
                  <h2>Account Info</h2>
                  <span>Your name and contact details</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="e.g., Karthik Seelam"
                  required
                />
                <span className="form-hint">This name will appear across the app</span>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input profile-email-readonly"
                  value={currentUser?.email || ''}
                  readOnly
                  tabIndex="-1"
                />
                <span className="form-hint">Email cannot be changed here</span>
              </div>

              <div className="sd-grid-2">
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

              <div className="form-group" style={{marginTop:'0.75rem'}}>
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

            {/* ── Academic Information ── */}
            <div className="form-section">
              <div className="section-heading">
                <div className="section-icon academic">📚</div>
                <div>
                  <h2>Academic Information</h2>
                  <span>Your scores and grades</span>
                </div>
              </div>

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
                <span className="form-hint">Enter CGPA (out of 10) or Percentage</span>
              </div>

              <div className="exam-sub-label">Entrance Exam Scores <span style={{fontSize:'0.72rem', color:'#3b82f6', marginLeft:'0.25rem', textTransform:'none', letterSpacing:0}}>(Optional)</span></div>

              <div className="sd-grid-2">
                <div className="form-group">
                  <label className="form-label">JEE Score <span style={{fontWeight:400,color:'#64748b'}}>(percentile, 0–100)</span></label>
                  <input type="number" min="0" max="100" step="0.01" className="form-input" name="exam_jee"
                    value={formData.examScores.jee} onChange={handleChange} placeholder="e.g., 95.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">NEET Score <span style={{fontWeight:400,color:'#64748b'}}>(marks, 0–720)</span></label>
                  <input type="number" min="0" max="720" step="1" className="form-input" name="exam_neet"
                    value={formData.examScores.neet} onChange={handleChange} placeholder="e.g., 620" />
                </div>
                <div className="form-group">
                  <label className="form-label">CAT Score <span style={{fontWeight:400,color:'#64748b'}}>(percentile, 0–100)</span></label>
                  <input type="number" min="0" max="100" step="0.01" className="form-input" name="exam_cat"
                    value={formData.examScores.cat} onChange={handleChange} placeholder="e.g., 98.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">GMAT Score <span style={{fontWeight:400,color:'#64748b'}}>(200–800)</span></label>
                  <input type="number" min="200" max="800" step="1" className="form-input" name="exam_gmat"
                    value={formData.examScores.gmat} onChange={handleChange} placeholder="e.g., 710" />
                </div>
              </div>

              <div className="form-group" style={{marginTop:'0.75rem'}}>
                <label className="form-label">Other Exam</label>
                <input type="text" className="form-input" name="exam_other"
                  value={formData.examScores.other} onChange={handleChange} placeholder="e.g., GATE – 750/1000" />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/student')}>Cancel</button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Saving…' : 'Save Profile'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
