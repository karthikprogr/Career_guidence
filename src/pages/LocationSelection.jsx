import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logSuccess, logError } from '../logger';
import './Selection.css';

const locations = [
  {
    id: 'India',
    name: 'India',
    icon: '🇮🇳',
    description: 'Study in India',
    highlights: ['Lower Fees', 'Familiar Culture', 'Wide Range of Options']
  },
  {
    id: 'Abroad',
    name: 'Abroad',
    icon: '🌍',
    description: 'Study Abroad',
    highlights: ['Global Exposure', 'International Standards', 'Career Opportunities']
  }
];

function LocationSelection() {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selected) {
      alert('Please select a location');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'students', auth.currentUser.uid), {
        'preferences.location': selected
      });
      
      logSuccess('STUDENT', 'Location preference updated', { location: selected });
      navigate('/student-details');
    } catch (error) {
      logError('STUDENT', 'Failed to update location preference', { error: error.message });
      alert('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="selection-page">
      <div className="container">
        <div className="selection-header">
          <h1>Choose Your Location</h1>
          <p>Where would you like to study?</p>
        </div>

        <div className="location-grid">
          {locations.map(location => (
            <div
              key={location.id}
              className={`location-card ${selected === location.id ? 'selected' : ''}`}
              onClick={() => setSelected(location.id)}
            >
              <div className="location-icon">{location.icon}</div>
              <h2>{location.name}</h2>
              <p className="location-desc">{location.description}</p>
              <ul className="location-highlights">
                {location.highlights.map((highlight, idx) => (
                  <li key={idx}>✓ {highlight}</li>
                ))}
              </ul>
              {selected === location.id && <div className="check-mark">✓</div>}
            </div>
          ))}
        </div>

        <div className="selection-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/career-selection')}
          >
            ← Back
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!selected || loading}
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationSelection;
