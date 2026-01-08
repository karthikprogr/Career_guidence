import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logSuccess, logError } from '../logger';
import './Selection.css';

const careers = [
  { id: 'engineering', name: 'Engineering', icon: '⚙️', description: 'Technology & Engineering' },
  { id: 'management', name: 'Management', icon: '💼', description: 'Business & Management' },
  { id: 'medical', name: 'Medical', icon: '⚕️', description: 'Healthcare & Medicine' },
  { id: 'law', name: 'Law', icon: '⚖️', description: 'Legal Studies' },
  { id: 'science', name: 'Science', icon: '🔬', description: 'Pure Sciences' },
  { id: 'arts', name: 'Arts', icon: '🎨', description: 'Arts & Humanities' }
];

function CareerSelection() {
  const [selected, setSelected] = useState('');
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

  return (
    <div className="selection-page">
      <div className="container">
        <div className="selection-header">
          <h1>Choose Your Career Path</h1>
          <p>Select the field you're interested in pursuing</p>
        </div>

        <div className="selection-grid">
          {careers.map(career => (
            <div
              key={career.id}
              className={`selection-card ${selected === career.id ? 'selected' : ''}`}
              onClick={() => setSelected(career.id)}
            >
              <div className="selection-icon">{career.icon}</div>
              <h3>{career.name}</h3>
              <p>{career.description}</p>
              {selected === career.id && <div className="check-mark">✓</div>}
            </div>
          ))}
        </div>

        <div className="selection-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/student')}
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

export default CareerSelection;
