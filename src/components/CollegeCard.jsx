import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CollegeCard.css';

function CollegeCard({ college }) {
  const navigate = useNavigate();

  // Helper function to safely format fees
  const formatFees = (fees) => {
    if (!fees && fees !== 0) return 'Not Available';
    return `₹${fees.toLocaleString()}`;
  };

  return (
    <div className="college-card">
      <div className="college-card-header">
        <h3>{college.name || 'Unnamed College'}</h3>
        <span className="college-ranking">Rank: {college.ranking || 'N/A'}</span>
      </div>
      
      <div className="college-card-body">
        <div className="college-info">
          <p><strong>Location:</strong> {college.location || 'Not specified'}</p>
          <p><strong>Type:</strong> {college.type || 'Not specified'}</p>
          <p><strong>Fees:</strong> {formatFees(college.fees)}/year</p>
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
