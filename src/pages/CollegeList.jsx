import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { logInfo, logError } from '../logger';
import CollegeCard from '../components/CollegeCard';
import './CollegeList.css';

function CollegeList() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [filters, setFilters] = useState({
    location: 'all',
    minFees: '',
    maxFees: '',
    minRanking: '',
    type: 'all'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [colleges, filters, studentData]);

  const fetchData = async () => {
    try {
      // Fetch student data
      const studentDoc = await getDoc(doc(db, 'students', auth.currentUser.uid));
      if (studentDoc.exists()) {
        setStudentData(studentDoc.data());
      }

      // Fetch colleges
      const collegesSnapshot = await getDocs(collection(db, 'colleges'));
      const collegesData = collegesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Colleges fetched from database:', collegesData.length);
      console.table(collegesData.slice(0, 5)); // Show first 5 for debugging
      
      setColleges(collegesData);
      logInfo('STUDENT', 'Colleges fetched', { count: collegesData.length });
    } catch (error) {
      console.error('Error fetching data:', error);
      logError('STUDENT', 'Failed to fetch colleges', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...colleges];

    // Show all colleges if no colleges exist
    if (colleges.length === 0) {
      setFilteredColleges([]);
      return;
    }

    // Filter by location preference (only if explicitly selected)
    if (filters.location !== 'all') {
      filtered = filtered.filter(college => 
        college.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(college => 
        college.type.toLowerCase().includes(filters.type.toLowerCase())
      );
    }

    // Filter by fees range
    if (filters.minFees) {
      filtered = filtered.filter(college => 
        college.fees >= parseFloat(filters.minFees)
      );
    }
    if (filters.maxFees) {
      filtered = filtered.filter(college => 
        college.fees <= parseFloat(filters.maxFees)
      );
    }

    // Filter by ranking
    if (filters.minRanking) {
      filtered = filtered.filter(college => 
        college.ranking <= parseInt(filters.minRanking)
      );
    }

    // Only filter by CGPA eligibility if student has CGPA and filters are applied
    // This ensures colleges show up even if student hasn't completed profile
    const hasActiveFilters = filters.location !== 'all' || filters.type !== 'all' || 
                              filters.minFees || filters.maxFees || filters.minRanking;
    
    if (studentData?.cgpa && hasActiveFilters) {
      // Show both eligible and ineligible, but mark them
      filtered = filtered.map(college => ({
        ...college,
        isEligible: studentData.cgpa >= (college.minCGPA || 0)
      }));
    }

    // Sort by ranking
    filtered.sort((a, b) => a.ranking - b.ranking);

    setFilteredColleges(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      location: 'all',
      minFees: '',
      maxFees: '',
      minRanking: '',
      type: 'all'
    });
  };

  const toggleCollegeForComparison = (collegeId) => {
    setSelectedForComparison(prev => {
      if (prev.includes(collegeId)) {
        return prev.filter(id => id !== collegeId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 colleges at a time');
          return prev;
        }
        return [...prev, collegeId];
      }
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      alert('Please select at least 2 colleges to compare');
      return;
    }
    navigate(`/college-compare?ids=${selectedForComparison.join(',')}`);
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  return (
    <div className="college-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Available Colleges</h1>
          <p>Showing {filteredColleges.length} colleges matching your criteria</p>
        </div>

        {/* Eligibility Info */}
        {studentData?.cgpa && (
          <div className="eligibility-info">
            <h3>Your Eligibility</h3>
            <p>CGPA: <strong>{studentData.cgpa}</strong></p>
            {studentData.preferences?.career && (
              <p>Career: <strong>{studentData.preferences.career}</strong></p>
            )}
            {studentData.preferences?.location && (
              <p>Preferred Location: <strong>{studentData.preferences.location}</strong></p>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <h3>Filters</h3>
          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                className="form-select"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="all">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="all">All Types</option>
                <option value="engineering">Engineering</option>
                <option value="management">Management</option>
                <option value="medical">Medical</option>
                <option value="law">Law</option>
                <option value="science">Science</option>
                <option value="arts">Arts</option>
                <option value="commerce">Commerce</option>
                <option value="design">Design</option>
                <option value="media">Media</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Min Fees (₹)</label>
              <input
                type="number"
                className="form-input"
                name="minFees"
                value={filters.minFees}
                onChange={handleFilterChange}
                placeholder="e.g., 100000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Fees (₹)</label>
              <input
                type="number"
                className="form-input"
                name="maxFees"
                value={filters.maxFees}
                onChange={handleFilterChange}
                placeholder="e.g., 500000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Ranking</label>
              <input
                type="number"
                className="form-input"
                name="minRanking"
                value={filters.minRanking}
                onChange={handleFilterChange}
                placeholder="e.g., 100"
              />
            </div>

            <div className="form-group">
              <button className="btn btn-secondary" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Toolbar */}
        {selectedForComparison.length > 0 && (
          <div className="comparison-toolbar">
            <div className="toolbar-content">
              <span className="selection-count">
                {selectedForComparison.length} college{selectedForComparison.length > 1 ? 's' : ''} selected
              </span>
              <div className="toolbar-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSelectedForComparison([])}
                >
                  Clear Selection
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCompare}
                  disabled={selectedForComparison.length < 2}
                >
                  Compare Selected ({selectedForComparison.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Colleges Grid */}
        {filteredColleges.length > 0 ? (
          <div className="colleges-grid">
            {filteredColleges.map(college => (
              <div key={college.id} className="college-card-wrapper">
                <input
                  type="checkbox"
                  className="compare-checkbox"
                  checked={selectedForComparison.includes(college.id)}
                  onChange={() => toggleCollegeForComparison(college.id)}
                  title="Select for comparison"
                />
                <CollegeCard college={college} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            {colleges.length === 0 ? (
              <>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>🏫</div>
                <h3 style={{ marginBottom: '1rem' }}>No Colleges Available</h3>
                <p style={{ marginBottom: '1rem', color: '#718096', maxWidth: '600px', margin: '0 auto 1rem' }}>
                  The college database is currently empty. Colleges need to be added by an administrator.
                </p>
                
                <div style={{ 
                  background: '#f7fafc', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '12px', 
                  padding: '2rem', 
                  maxWidth: '700px', 
                  margin: '2rem auto',
                  textAlign: 'left'
                }}>
                  <h4 style={{ marginBottom: '1rem', color: '#2d3748' }}>📋 How to Add Colleges:</h4>
                  <ol style={{ color: '#4a5568', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                    <li><strong>Logout</strong> from your student account</li>
                    <li><strong>Login as Admin</strong> using admin credentials</li>
                    <li>Go to <strong>Admin Dashboard</strong> → <strong>Colleges</strong> tab</li>
                    <li>Click the blue <strong>"Add Sample Colleges"</strong> button (adds 15 Indian colleges)</li>
                    <li>Or click <strong>"Import from API"</strong> (adds 480+ worldwide colleges)</li>
                    <li><strong>Logout</strong> and <strong>login back as student</strong></li>
                  </ol>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.location.reload()}
                  >
                    🔄 Refresh Page
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      if (window.confirm('This will logout your current session. Continue?')) {
                        navigate('/login');
                      }
                    }}
                  >
                    🔐 Go to Login
                  </button>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '2rem' }}>
                  💡 <strong>Tip:</strong> After colleges are added, refresh this page to see them.
                </p>
              </>
            ) : (
              <>
                <h3>No colleges match your filters</h3>
                <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
                  Try adjusting your filters or reset to see all available colleges.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeList;
