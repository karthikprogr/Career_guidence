import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo, logSuccess } from '../logger';
import './AptitudeTest.css';

function AptitudeTest() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, testStarted]);

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Shuffle and limit to 30 questions (10 from each category)
      const verbal = questionsData.filter(q => q.category === 'verbal').slice(0, 10);
      const quantitative = questionsData.filter(q => q.category === 'quantitative').slice(0, 10);
      const general = questionsData.filter(q => q.category === 'general').slice(0, 10);
      
      const allQuestions = [...verbal, ...quantitative, ...general];
      setQuestions(allQuestions);
      
      logInfo('APTITUDE_TEST', 'Questions loaded', { count: allQuestions.length });
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
    logInfo('APTITUDE_TEST', 'Test started', { studentId: auth.currentUser.uid });
  };

  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / questions.length) * 100;
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit the test?')) {
      return;
    }

    const score = calculateScore();

    try {
      // Save test result
      await setDoc(doc(db, 'testResults', auth.currentUser.uid), {
        studentId: auth.currentUser.uid,
        score: score,
        totalQuestions: questions.length,
        correctAnswers: Math.round((score / 100) * questions.length),
        answers: answers,
        completedAt: serverTimestamp()
      });

      // Update student profile
      await setDoc(doc(db, 'students', auth.currentUser.uid), {
        aptitudeScore: score
      }, { merge: true });

      logSuccess('APTITUDE_TEST', 'Test completed', { 
        score: score,
        correctAnswers: Math.round((score / 100) * questions.length)
      });

      navigate('/test-completion', { state: { score } });
    } catch (error) {
      console.error('Error saving test result:', error);
      alert('Failed to save test result. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return <div className="spinner" style={{ margin: '4rem auto' }}></div>;
  }

  if (questions.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>No questions available</h2>
        <p>Please contact admin to add aptitude test questions.</p>
        <button className="btn btn-primary" onClick={() => navigate('/student')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="aptitude-test-page">
        <div className="container">
          <div className="test-instructions">
            <h1>Aptitude Test Instructions</h1>
            
            <div className="instructions-card">
              <h2>📝 Test Details</h2>
              <ul>
                <li>Total Questions: <strong>{questions.length}</strong></li>
                <li>Time Limit: <strong>30 minutes</strong></li>
                <li>Sections: Verbal, Quantitative, General Knowledge</li>
                <li>Each question carries equal marks</li>
              </ul>
            </div>

            <div className="instructions-card">
              <h2>📌 Important Instructions</h2>
              <ol>
                <li>Read each question carefully before answering</li>
                <li>You can navigate between questions using Previous/Next buttons</li>
                <li>You can change your answers before submitting</li>
                <li>The test will auto-submit when time expires</li>
                <li>Ensure stable internet connection throughout the test</li>
                <li>Do not refresh or close the browser during the test</li>
              </ol>
            </div>

            <div className="instructions-card">
              <h2>✓ Ready to Begin?</h2>
              <p>Make sure you are in a quiet environment and have 30 minutes available.</p>
              <button className="btn btn-primary btn-large" onClick={handleStartTest}>
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="aptitude-test-page">
      <div className="container">
        {/* Test Header */}
        <div className="test-header">
          <div className="test-progress">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className={`test-timer ${timeLeft < 300 ? 'timer-warning' : ''}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-meta">
            <span className={`category-badge badge-${currentQ.category}`}>
              {currentQ.category}
            </span>
            <span className={`difficulty-badge badge-${currentQ.difficulty}`}>
              {currentQ.difficulty}
            </span>
          </div>

          <h2 className="question-text">{currentQ.question}</h2>

          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                className={`option ${answers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswer(index)}
              >
                <div className="option-radio">
                  {answers[currentQuestion] === index && <div className="radio-dot"></div>}
                </div>
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="test-navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          <div className="question-indicators">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`question-indicator ${
                  index === currentQuestion ? 'current' : ''
                } ${answers[index] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AptitudeTest;
