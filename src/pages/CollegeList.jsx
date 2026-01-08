import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo } from '../logger';
import CollegeCard from '../components/CollegeCard';
import './CollegeList.css';

function CollegeList() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      
      setColleges(collegesData);
      logInfo('STUDENT', 'Colleges fetched', { count: collegesData.length });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...colleges];

    // Filter by CGPA eligibility
    if (studentData?.cgpa) {
      filtered = filtered.filter(college => 
        studentData.cgpa >= (college.minCGPA || 0)
      );
    }

    // Filter by location preference
    if (filters.location !== 'all') {
      filtered = filtered.filter(college => 
        college.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    } else if (studentData?.preferences?.location && studentData.preferences.location !== 'India') {
      // Use student's preference if no filter selected (skip if preference is just "India")
      filtered = filtered.filter(college => 
        college.location?.toLowerCase().includes(studentData.preferences.location.toLowerCase())
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

        {/* Colleges Grid */}
        {filteredColleges.length > 0 ? (
          <div className="colleges-grid">
            {filteredColleges.map(college => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No colleges found</h3>
            <p>Try adjusting your filters or complete your profile to see eligible colleges.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeList;
