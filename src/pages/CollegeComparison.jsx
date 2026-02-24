import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { logInfo } from '../logger';
import { TrophyIcon, MoneyIcon, BuildingIcon, ChartIcon } from '../components/Icons';
import './CollegeComparison.css';

function CollegeComparison() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, [searchParams]);

  const fetchColleges = async () => {
    const collegeIds = searchParams.get('ids')?.split(',') || [];
    
    if (collegeIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const collegePromises = collegeIds.map(id => 
        getDoc(doc(db, 'colleges', id))
      );
      
      const collegeDocs = await Promise.all(collegePromises);
      const collegesData = collegeDocs
        .filter(doc => doc.exists())
        .map(doc => ({ id: doc.id, ...doc.data() }));
      
      setColleges(collegesData);
      logInfo('STUDENT', 'Colleges comparison viewed', { count: collegesData.length });
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeCollege = (collegeId) => {
    const currentIds = searchParams.get('ids')?.split(',') || [];
    const newIds = currentIds.filter(id => id !== collegeId);
    
    if (newIds.length === 0) {
      navigate('/college-list');
    } else {
      navigate(`/college-compare?ids=${newIds.join(',')}`);
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  if (colleges.length === 0) {
    return (
      <div className="college-comparison-page">
        <div className="container">
          <div className="empty-state">
            <h2>No Colleges Selected</h2>
            <p>Please select colleges from the college list to compare.</p>
            <button className="btn btn-primary" onClick={() => navigate('/college-list')}>
              Browse Colleges
            </button>
          </div>
        </div>
      </div>
    );
  }

  const comparisonRows = [
    { label: 'College Name', key: 'name', type: 'text' },
    { label: 'Location', key: 'location', type: 'text' },
    { label: 'Type', key: 'type', type: 'text' },
    { label: 'Ranking', key: 'ranking', type: 'number', better: 'lower' },
    { label: 'Annual Fees', key: 'fees', type: 'currency', better: 'lower' },
    { label: 'Min CGPA', key: 'minCGPA', type: 'number', better: 'lower' },
    { label: 'Placement Rate', key: 'placementRate', type: 'percentage', better: 'higher' },
  ];

  const getBestValue = (key, better) => {
    if (!better) return null;
    const values = colleges.map(c => c[key]).filter(v => v !== undefined);
    if (values.length === 0) return null;
    return better === 'higher' ? Math.max(...values) : Math.min(...values);
  };

  const isBest = (value, key, better) => {
    const bestValue = getBestValue(key, better);
    return bestValue !== null && value === bestValue;
  };

  const formatValue = (value, type, key) => {
    if (value === undefined || value === null) return 'N/A';
    
    switch (type) {
      case 'currency':
        return `₹${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'number':
        return key === 'ranking' ? `#${value}` : value;
      default:
        return value;
    }
  };

  return (
    <div className="college-comparison-page">
      <div className="container">
        <div className="page-header">
          <h1>College Comparison</h1>
          <p>Compare {colleges.length} college{colleges.length > 1 ? 's' : ''} side by side</p>
        </div>

        <div className="comparison-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/college-list')}>
            ← Back to List
          </button>
          {colleges.length < 4 && (
            <button className="btn btn-primary" onClick={() => navigate('/college-list')}>
              + Add More Colleges
            </button>
          )}
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="sticky-col">Parameter</th>
                {colleges.map((college) => (
                  <th key={college.id} className="college-col">
                    <div className="college-header">
                      <button
                        className="remove-btn"
                        onClick={() => removeCollege(college.id)}
                        title="Remove from comparison"
                      >
                        ×
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.key}>
                  <td className="sticky-col label-cell">{row.label}</td>
                  {colleges.map((college) => {
                    const value = college[row.key];
                    const best = isBest(value, row.key, row.better);
                    return (
                      <td key={college.id} className={best ? 'best-value' : ''}>
                        <div className="value-cell">
                          {formatValue(value, row.type, row.key)}
                          {best && <span className="best-badge">Best</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              {/* Action Row */}
              <tr className="action-row">
                <td className="sticky-col label-cell">Actions</td>
                {colleges.map((college) => (
                  <td key={college.id}>
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/college/${college.id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate(`/college-apply/${college.id}`)}
                      >
                        Apply Now
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comparison Summary */}
        <div className="comparison-summary">
          <h2>Comparison Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <h3><TrophyIcon size={24} /> Best Ranking</h3>
              <p>{colleges.find(c => c.ranking === getBestValue('ranking', 'lower'))?.name || 'N/A'}</p>
              <span className="summary-value">#{getBestValue('ranking', 'lower')}</span>
            </div>
            <div className="summary-card">
              <h3><MoneyIcon size={24} /> Lowest Fees</h3>
              <p>{colleges.find(c => c.fees === getBestValue('fees', 'lower'))?.name || 'N/A'}</p>
              <span className="summary-value">₹{getBestValue('fees', 'lower')?.toLocaleString()}</span>
            </div>
            <div className="summary-card">
              <h3><BuildingIcon size={24} /> Best Placement</h3>
              <p>{colleges.find(c => c.placementRate === getBestValue('placementRate', 'higher'))?.name || 'N/A'}</p>
              <span className="summary-value">{getBestValue('placementRate', 'higher')}%</span>
            </div>
            <div className="summary-card">
              <h3><ChartIcon size={24} /> Lowest CGPA</h3>
              <p>{colleges.find(c => c.minCGPA === getBestValue('minCGPA', 'lower'))?.name || 'N/A'}</p>
              <span className="summary-value">{getBestValue('minCGPA', 'lower')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeComparison;
