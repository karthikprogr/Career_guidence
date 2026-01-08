import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './TestCompletion.css';

function TestCompletion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.score) {
      setScore(location.state.score);
      fetchTestResult();
    } else {
      fetchTestResult();
    }
  }, []);

  const fetchTestResult = async () => {
    try {
      const resultDoc = await getDoc(doc(db, 'testResults', auth.currentUser.uid));
      if (resultDoc.exists()) {
        const data = resultDoc.data();
        setTestResult(data);
        setScore(data.score);
      }
    } catch (error) {
      console.error('Error fetching test result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  if (!score && !testResult) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>No test results found</h2>
        <p>Please take the aptitude test first.</p>
        <button className="btn btn-primary" onClick={() => navigate('/aptitude-test')}>
          Take Test
        </button>
      </div>
    );
  }

  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: '#10b981', emoji: '🌟' };
    if (score >= 60) return { level: 'Good', color: '#3b82f6', emoji: '👍' };
    if (score >= 40) return { level: 'Average', color: '#f59e0b', emoji: '📈' };
    return { level: 'Needs Improvement', color: '#ef4444', emoji: '📚' };
  };

  const performance = getPerformanceLevel(score);

  return (
    <div className="test-completion-page">
      <div className="container">
        <div className="completion-card">
          {/* Success Icon */}
          <div className="success-icon">
            <div className="checkmark-circle">
              <div className="checkmark">✓</div>
            </div>
          </div>

          <h1>Test Completed!</h1>
          <p className="completion-message">
            Congratulations! You have successfully completed the aptitude test.
          </p>

          {/* Score Display */}
          <div className="score-display" style={{ borderColor: performance.color }}>
            <div className="score-label">Your Score</div>
            <div className="score-value" style={{ color: performance.color }}>
              {Math.round(score)}%
            </div>
            <div className="score-performance" style={{ color: performance.color }}>
              {performance.emoji} {performance.level}
            </div>
          </div>

          {/* Results Summary */}
          {testResult && (
            <div className="results-summary">
              <div className="result-item">
                <div className="result-icon">📝</div>
                <div>
                  <div className="result-label">Total Questions</div>
                  <div className="result-value">{testResult.totalQuestions}</div>
                </div>
              </div>

              <div className="result-item">
                <div className="result-icon">✅</div>
                <div>
                  <div className="result-label">Correct Answers</div>
                  <div className="result-value">{testResult.correctAnswers}</div>
                </div>
              </div>

              <div className="result-item">
                <div className="result-icon">❌</div>
                <div>
                  <div className="result-label">Wrong Answers</div>
                  <div className="result-value">
                    {testResult.totalQuestions - testResult.correctAnswers}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Analysis */}
          <div className="performance-analysis">
            <h3>What's Next?</h3>
            {score >= 60 ? (
              <div className="analysis-card success">
                <p>
                  Great job! Your performance shows strong aptitude. You are now eligible 
                  to apply for colleges. Browse the college list to find your perfect match.
                </p>
              </div>
            ) : (
              <div className="analysis-card warning">
                <p>
                  You can improve your score by taking the test again. Review your weak 
                  areas and try again for better college opportunities.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/college-list')}
            >
              View Eligible Colleges
            </button>
            <button 
              className="btn btn-outline btn-large"
              onClick={() => navigate('/student')}
            >
              Back to Dashboard
            </button>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <p>
              💡 <strong>Tip:</strong> Your aptitude score will be considered during 
              college selection along with your CGPA and preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestCompletion;
