import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CollegeCard.css';

function CollegeCard({ college }) {
  const navigate = useNavigate();

  return (
    <div className="college-card">
      <div className="college-card-header">
        <h3>{college.name}</h3>
        <span className="college-ranking">Rank: {college.ranking}</span>
      </div>
      
      <div className="college-card-body">
        <div className="college-info">
          <p><strong>Location:</strong> {college.location}</p>
          <p><strong>Type:</strong> {college.type}</p>
          <p><strong>Fees:</strong> ₹{college.fees.toLocaleString()}/year</p>
          <p><strong>Min CGPA:</strong> {college.minCGPA}</p>
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
