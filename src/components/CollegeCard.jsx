import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CollegeCard.css';

function CollegeCard({ college }) {
  const navigate = useNavigate();

  // Helper function to safely format fees with correct currency
  const formatFees = (fees, currency) => {
    if (!fees && fees !== 0) return 'Not Available';
    const sym = currency || 'INR';
    const symbols = { INR: '₹', USD: '$', GBP: '£', EUR: '€', AUD: 'A$', CAD: 'C$', SGD: 'S$', CHF: 'CHF ', SEK: 'kr ' };
    return `${symbols[sym] || sym + ' '}${fees.toLocaleString()}`;
  };

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
