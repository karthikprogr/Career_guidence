import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logSuccess, logError } from '../logger';
import { CheckIcon } from '../components/Icons';
import './Selection.css';

const careers = [
  {
    id: 'engineering',
    name: 'Engineering',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    ),
    color: '#2563eb',
    description: 'Build the future with technology. Engineers design, develop, and innovate solutions that shape the modern world, from software applications to bridges and circuits.',
    branches: ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Chemical'],
    avgSalary: '4-25 LPA (India) | $60K-$150K (Abroad)',
    entranceExams: 'JEE Main, JEE Advanced, BITSAT, VITEEE',
    jobRoles: ['Software Developer', 'Data Scientist', 'Civil Engineer', 'Mechanical Engineer', 'AI/ML Engineer'],
    demand: 'Very High',
    duration: '4 Years (B.Tech/B.E.)'
  },
  {
    id: 'management',
    name: 'Management',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    ),
    color: '#7c3aed',
    description: 'Lead organizations and drive business growth. Management professionals plan, organize, and lead teams to achieve business goals across industries.',
    branches: ['Finance', 'Marketing', 'Human Resources', 'Operations', 'Business Analytics'],
    avgSalary: '5-30 LPA (India) | $70K-$180K (Abroad)',
    entranceExams: 'CAT, XAT, GMAT, MAT, NMAT',
    jobRoles: ['Business Analyst', 'Marketing Manager', 'Financial Analyst', 'HR Manager', 'Consultant'],
    demand: 'High',
    duration: '3 Years (BBA) / 2 Years (MBA)'
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    ),
    color: '#dc2626',
    description: 'Save lives and improve health. Medical professionals diagnose, treat, and prevent diseases. This is a noble profession with immense job satisfaction and societal impact.',
    branches: ['General Medicine (MBBS)', 'Dental (BDS)', 'Pharmacy', 'Nursing', 'Biotechnology'],
    avgSalary: '5-50 LPA (India) | $80K-$300K (Abroad)',
    entranceExams: 'NEET UG, NEET PG, AIIMS, JIPMER',
    jobRoles: ['Doctor/Surgeon', 'Pharmacist', 'Dentist', 'Medical Researcher', 'Healthcare Admin'],
    demand: 'Very High',
    duration: '5.5 Years (MBBS) / 4 Years (BDS, B.Pharm)'
  },
  {
    id: 'law',
    name: 'Law',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
    color: '#d97706',
    description: 'Uphold justice and protect rights. Lawyers interpret laws, represent clients, and ensure justice is served. A career in law offers prestige and the ability to make a real difference.',
    branches: ['Corporate Law', 'Criminal Law', 'Civil Law', 'International Law', 'Intellectual Property'],
    avgSalary: '3-30 LPA (India) | $60K-$200K (Abroad)',
    entranceExams: 'CLAT, AILET, LSAT, BHU UET',
    jobRoles: ['Advocate', 'Corporate Lawyer', 'Legal Advisor', 'Judge', 'Legal Analyst'],
    demand: 'Medium-High',
    duration: '5 Years (BA LLB) / 3 Years (LLB)'
  },
  {
    id: 'science',
    name: 'Science',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    ),
    color: '#059669',
    description: 'Discover the unknown through research and experimentation. Scientists push the boundaries of human knowledge in physics, chemistry, biology, mathematics, and more.',
    branches: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Environmental Science'],
    avgSalary: '3-20 LPA (India) | $50K-$120K (Abroad)',
    entranceExams: 'IIT JAM, JEST, CSIR NET, GATE',
    jobRoles: ['Research Scientist', 'Lab Analyst', 'Data Analyst', 'Professor', 'Science Writer'],
    demand: 'Medium',
    duration: '3 Years (B.Sc) / 2 Years (M.Sc)'
  },
  {
    id: 'arts',
    name: 'Arts & Humanities',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
    color: '#ec4899',
    description: 'Express creativity and shape culture. Arts professionals create, design, and communicate ideas through visual arts, literature, media, and performing arts.',
    branches: ['Graphic Design', 'Fine Arts', 'Journalism', 'Film & Media', 'Literature'],
    avgSalary: '3-15 LPA (India) | $40K-$100K (Abroad)',
    entranceExams: 'NID, NIFT, UCEED, CEED',
    jobRoles: ['Graphic Designer', 'Content Writer', 'Journalist', 'Film Director', 'UX Designer'],
    demand: 'Growing',
    duration: '3-4 Years (BA / BFA / B.Des)'
  }
];

function CareerSelection() {
  const [selected, setSelected] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selected) {
      alert('Please select a career option');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'students', auth.currentUser.uid), {
        'preferences.career': selected
      });
      
      logSuccess('STUDENT', 'Career preference updated', { career: selected });
      navigate('/location-selection');
    } catch (error) {
      logError('STUDENT', 'Failed to update career preference', { error: error.message });
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (careerId) => {
    setExpandedCard(expandedCard === careerId ? null : careerId);
  };

  return (
    <div className="selection-page">
      <div className="container">
        <div className="selection-header">
          <h1>Choose Your Career Path</h1>
          <p>Explore each field to understand what it offers, then select the one that excites you the most</p>
        </div>

        <div className="career-selection-grid">
          {careers.map(career => (
            <div
              key={career.id}
              className={`career-detail-card ${selected === career.id ? 'selected' : ''} ${expandedCard === career.id ? 'expanded' : ''}`}
            >
              <div className="career-card-header" onClick={() => setSelected(career.id)}>
                <div className="career-card-icon" style={{ background: career.color }}>
                  {career.icon}
                </div>
                <div className="career-card-title">
                  <h3>{career.name}</h3>
                  <span className="career-duration">{career.duration}</span>
                </div>
                {selected === career.id && (
                  <div className="career-check">
                    <CheckIcon size={20} color="#ffffff" />
                  </div>
                )}
              </div>

              <p className="career-card-desc">{career.description}</p>

              <div className="career-quick-info">
                <div className="quick-info-item">
                  <span className="info-label">Avg. Salary</span>
                  <span className="info-value">{career.avgSalary}</span>
                </div>
                <div className="quick-info-item">
                  <span className="info-label">Demand</span>
                  <span className={`info-badge demand-${career.demand.toLowerCase().replace(/[- ]/g, '')}`}>
                    {career.demand}
                  </span>
                </div>
              </div>

              <button 
                className="career-expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(career.id);
                }}
              >
                {expandedCard === career.id ? 'Show Less' : 'View Details'}
                <svg 
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: expandedCard === career.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {expandedCard === career.id && (
                <div className="career-expanded-info">
                  <div className="expanded-section">
                    <h4>Popular Branches</h4>
                    <div className="branch-tags">
                      {career.branches.map((branch, idx) => (
                        <span key={idx} className="branch-tag">{branch}</span>
                      ))}
                    </div>
                  </div>

                  <div className="expanded-section">
                    <h4>Entrance Exams</h4>
                    <p>{career.entranceExams}</p>
                  </div>

                  <div className="expanded-section">
                    <h4>Common Job Roles</h4>
                    <ul className="job-roles-list">
                      {career.jobRoles.map((role, idx) => (
                        <li key={idx}>
                          <CheckIcon size={14} color="#10b981" /> {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="selection-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/student')}
          >
            Back to Dashboard
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!selected || loading}
          >
            {loading ? 'Saving...' : 'Continue to Location'}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CareerSelection;
