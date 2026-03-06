import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CollegeCard.css';

const EXAM_SCORE_MAP = { JEE: 'jee', NEET: 'neet', CAT: 'cat', GMAT: 'gmat' };
const EXAM_UNIT = { JEE: 'percentile', NEET: 'marks', CAT: 'percentile', GMAT: 'score' };

function CollegeCard({ college, studentExamScores }) {
  const navigate = useNavigate();

  const formatFees = (fees, currency) => {
    if (!fees && fees !== 0) return 'Not Available';
    const sym = currency || 'INR';
    const symbols = { INR: '₹', USD: '$', GBP: '£', EUR: '€', AUD: 'A$', CAD: 'C$', SGD: 'S$', CHF: 'CHF ', SEK: 'kr ' };
    return `${symbols[sym] || sym + ' '}${fees.toLocaleString()}`;
  };

  const getExamStatus = () => {
    const exam = college.requiredExam;
    if (!exam || exam === 'None') return null;
    const field = EXAM_SCORE_MAP[exam];
    if (!field || !studentExamScores) return { exam, minScore: college.minimumExamScore, met: null };
    const studentScore = parseFloat(studentExamScores[field] || 0);
    const met = studentScore >= (college.minimumExamScore || 0);
    return { exam, minScore: college.minimumExamScore, studentScore, met };
  };

  const examStatus = getExamStatus();

  return (
    <div className="college-card">
      <div className="college-card-header">
        <h3>{college.name || 'Unnamed College'}</h3>
        <span className="college-ranking">Rank: {college.ranking || 'N/A'}</span>
      </div>
      
      <div className="college-card-body">
        <div className="college-info">
          <p><strong>Location:</strong> {college.location || [college.city, college.state, college.country].filter(Boolean).join(', ') || 'Not specified'}</p>
          <p><strong>Type:</strong>{' '}
            {(college.types && college.types.length > 0 ? college.types : (college.type ? [college.type] : ['Not specified'])).map((t, i) => (
              <span key={i} style={{display:'inline-block',background:'#eff6ff',color:'#1d4ed8',fontSize:'0.72rem',fontWeight:600,padding:'0.1rem 0.45rem',borderRadius:'0.25rem',marginRight:'0.2rem'}}>{t}</span>
            ))}
          </p>
          <p><strong>Fees:</strong> {formatFees(college.fees, college.currency)}/year</p>
          <p><strong>Min CGPA:</strong> {college.minCGPA || 'N/A'}</p>
          {examStatus && (
            <p>
              <strong>Entrance Exam:</strong>{' '}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                background: examStatus.met === true ? '#052e16' : examStatus.met === false ? '#450a0a' : '#1e293b',
                color: examStatus.met === true ? '#4ade80' : examStatus.met === false ? '#f87171' : '#94a3b8',
                fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.5rem',
                borderRadius: '0.25rem'
              }}>
                {examStatus.exam} ≥ {examStatus.minScore} {EXAM_UNIT[examStatus.exam] || ''}
                {examStatus.met === true && ' ✓'}
                {examStatus.met === false && ' ✗'}
              </span>
            </p>
          )}
        </div>
        
        {college.placementRate && (
          <div className="college-placement">
            <p><strong>Placement Rate:</strong> {college.placementRate}%</p>
          </div>
        )}
        
        <div className="college-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/college/${college.id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollegeCard;
