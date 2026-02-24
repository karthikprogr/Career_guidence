import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { logInfo, logError } from '../logger';
import { FileTextIcon, ClockIcon, CheckIcon, CloseIcon, DocumentIcon } from '../components/Icons';
import './ApplicationHistory.css';

function ApplicationHistory() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const q = query(
        collection(db, 'applications'),
        where('studentId', '==', auth.currentUser.uid),
        orderBy('appliedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const appData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate()
      }));

      setApplications(appData);
      logInfo('STUDENT', 'Applications fetched', { count: appData.length });
    } catch (error) {
      logError('STUDENT', 'Failed to fetch applications', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      case 'interview':
        return 'status-interview';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Under Review';
      case 'interview':
        return 'Interview Scheduled';
      default:
        return status;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  return (
    <div className="application-history-page">
      <div className="container">
        <div className="page-header">
          <h1>My Applications</h1>
          <p>Track all your college applications in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><FileTextIcon size={32} /></div>
            <div className="stat-info">
              <h3>{applications.length}</h3>
              <p>Total Applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><ClockIcon size={32} /></div>
            <div className="stat-info">
              <h3>{applications.filter(a => a.status === 'pending').length}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckIcon size={32} color="#10b981" /></div>
            <div className="stat-info">
              <h3>{applications.filter(a => a.status === 'approved').length}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CloseIcon size={32} color="#ef4444" /></div>
            <div className="stat-info">
              <h3>{applications.filter(a => a.status === 'rejected').length}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({applications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({applications.filter(a => a.status === 'approved').length})
          </button>
          <button
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({applications.filter(a => a.status === 'rejected').length})
          </button>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="applications-list">
            {filteredApplications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <div>
                    <h3>{app.collegeName}</h3>
                    <p className="applied-date">
                      Applied on: {app.appliedAt?.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                    {getStatusText(app.status)}
                  </span>
                </div>

                <div className="application-details">
                  <div className="detail-item">
                    <span className="label">Preferred Course:</span>
                    <span className="value">{app.preferredCourse}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">CGPA:</span>
                    <span className="value">{app.cgpa}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Test Score:</span>
                    <span className="value">{app.testScore}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Phone:</span>
                    <span className="value">{app.phone}</span>
                  </div>
                </div>

                {app.adminRemarks && (
                  <div className="admin-remarks">
                    <strong>College Remarks:</strong>
                    <p>{app.adminRemarks}</p>
                  </div>
                )}

                <div className="application-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/college-details/${app.collegeId}`)}
                  >
                    View College
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-applications">
            <div className="empty-state">
              <span className="empty-icon"><DocumentIcon size={64} color="#cbd5e0" /></span>
              <h3>No applications found</h3>
              <p>
                {filter === 'all'
                  ? "You haven't applied to any colleges yet."
                  : `No ${filter} applications.`}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/college-list')}
              >
                Browse Colleges
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationHistory;
