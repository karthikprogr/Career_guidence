import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo, logError, logSuccess } from '../logger';
import { generateQuestions, isGeminiAvailable } from '../services/geminiAPI';
import { getAvailableCountries, searchColleges } from '../services/collegeAPI';
import './AdminDashboard.css';
import '../components/Modals.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('colleges');
  const [colleges, setColleges] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // API Import states
  const [showCollegeImportModal, setShowCollegeImportModal] = useState(false);
  const [collegeSearchResults, setCollegeSearchResults] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [collegeSearchTerm, setCollegeSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [apiLoading, setApiLoading] = useState(false);

  // AI Generation states
  const [showAIGenerateModal, setShowAIGenerateModal] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [aiGenerationConfig, setAiGenerationConfig] = useState({
    category: 'verbal',
    difficulty: 'medium',
    count: 10
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [geminiAvailable, setGeminiAvailable] = useState(false);

  // Edit mode states
  const [editingCollege, setEditingCollege] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Question category selection
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState('all');

  // College form state
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    location: '',
    type: '',
    fees: '',
    ranking: '',
    minCGPA: '',
    placementRate: '',
    description: '',
    facilities: '',
    scholarships: ''
  });

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: 'verbal',
    difficulty: 'medium'
  });

  useEffect(() => {
    if (activeTab === 'colleges') {
      fetchColleges();
    } else if (activeTab === 'questions') {
      fetchQuestions();
    }
    
    // Check if Gemini API is available
    setGeminiAvailable(isGeminiAvailable());
  }, [activeTab]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'colleges'));
      const collegesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setColleges(collegesData);
      logInfo('ADMIN', 'Colleges fetched', { count: collegesData.length });
    } catch (error) {
      logError('ADMIN', 'Failed to fetch colleges', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(questionsData);
      logInfo('ADMIN', 'Questions fetched', { count: questionsData.length });
    } catch (error) {
      logError('ADMIN', 'Failed to fetch questions', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollege = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const collegeData = {
        ...collegeForm,
        fees: parseFloat(collegeForm.fees),
        ranking: parseInt(collegeForm.ranking),
        minCGPA: parseFloat(collegeForm.minCGPA),
        placementRate: parseFloat(collegeForm.placementRate),
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      };

      await addDoc(collection(db, 'colleges'), collegeData);
      logSuccess('ADMIN', 'College added successfully', { collegeName: collegeForm.name });
      
      // Reset form
      setCollegeForm({
        name: '',
        location: '',
        type: '',
        fees: '',
        ranking: '',
        minCGPA: '',
        placementRate: '',
        description: '',
        facilities: '',
        scholarships: ''
      });
      setShowForm(false);
      fetchColleges();
    } catch (error) {
      logError('ADMIN', 'Failed to add college', { error: error.message });
      alert('Failed to add college. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCollege = (college) => {
    setEditingCollege(college.id);
    setCollegeForm({
      name: college.name,
      location: college.location,
      type: college.type,
      fees: college.fees.toString(),
      ranking: college.ranking.toString(),
      minCGPA: college.minCGPA.toString(),
      placementRate: college.placementRate.toString(),
      description: college.description || '',
      facilities: college.facilities || '',
      scholarships: college.scholarships || ''
    });
    setShowForm(true);
  };

  const handleUpdateCollege = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const collegeData = {
        ...collegeForm,
        fees: parseFloat(collegeForm.fees),
        ranking: parseInt(collegeForm.ranking),
        minCGPA: parseFloat(collegeForm.minCGPA),
        placementRate: parseFloat(collegeForm.placementRate),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid
      };

      await updateDoc(doc(db, 'colleges', editingCollege), collegeData);
      logSuccess('ADMIN', 'College updated successfully', { collegeId: editingCollege, collegeName: collegeForm.name });
      
      // Reset form
      setCollegeForm({
        name: '',
        location: '',
        type: '',
        fees: '',
        ranking: '',
        minCGPA: '',
        placementRate: '',
        description: '',
        facilities: '',
        scholarships: ''
      });
      setEditingCollege(null);
      setShowForm(false);
      fetchColleges();
    } catch (error) {
      logError('ADMIN', 'Failed to update college', { error: error.message });
      alert('Failed to update college. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollege = async (collegeId, collegeName) => {
    if (window.confirm(`Are you sure you want to delete ${collegeName}?`)) {
      try {
        await deleteDoc(doc(db, 'colleges', collegeId));
        logSuccess('ADMIN', 'College deleted successfully', { collegeId, collegeName });
        fetchColleges();
      } catch (error) {
        logError('ADMIN', 'Failed to delete college', { error: error.message });
        alert('Failed to delete college. Please try again.');
      }
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const questionData = {
        ...questionForm,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      };

      await addDoc(collection(db, 'questions'), questionData);
      logSuccess('ADMIN', 'Question added successfully');

      // Reset form
      setQuestionForm({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        category: 'verbal',
        difficulty: 'medium'
      });
      setShowForm(false);
      fetchQuestions();
    } catch (error) {
      logError('ADMIN', 'Failed to add question', { error: error.message });
      alert('Failed to add question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question.id);
    setQuestionForm({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      category: question.category,
      difficulty: question.difficulty
    });
    setShowForm(true);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const questionData = {
        ...questionForm,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid
      };

      await updateDoc(doc(db, 'questions', editingQuestion), questionData);
      logSuccess('ADMIN', 'Question updated successfully', { questionId: editingQuestion });

      // Reset form
      setQuestionForm({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        category: 'verbal',
        difficulty: 'medium'
      });
      setEditingQuestion(null);
      setShowForm(false);
      fetchQuestions();
    } catch (error) {
      logError('ADMIN', 'Failed to update question', { error: error.message });
      alert('Failed to update question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteDoc(doc(db, 'questions', questionId));
        logSuccess('ADMIN', 'Question deleted successfully', { questionId });
        fetchQuestions();
      } catch (error) {
        logError('ADMIN', 'Failed to delete question', { error: error.message });
        alert('Failed to delete question. Please try again.');
      }
    }
  };

  // College API Import Functions
  const handleSearchColleges = async () => {
    if (!collegeSearchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    setApiLoading(true);
    try {
      const results = await searchColleges(collegeSearchTerm, selectedCountry);
      setCollegeSearchResults(results);
      logInfo('ADMIN', 'College search completed', { 
        searchTerm: collegeSearchTerm, 
        country: selectedCountry,
        resultsCount: results.length 
      });
      
      if (results.length === 0) {
        alert('No colleges found. Try a different search term or country.');
      }
    } catch (error) {
      logError('ADMIN', 'College search failed', { error: error.message });
      alert('Failed to search colleges. Please try again.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleToggleCollegeSelection = (college) => {
    setSelectedColleges(prev => {
      const collegeId = college.web_pages?.[0] || college.name;
      const isSelected = prev.some(c => (c.web_pages?.[0] || c.name) === collegeId);
      if (isSelected) {
        return prev.filter(c => (c.web_pages?.[0] || c.name) !== collegeId);
      } else {
        return [...prev, college];
      }
    });
  };

  const handleImportSelectedColleges = async () => {
    if (selectedColleges.length === 0) {
      alert('Please select at least one college to import');
      return;
    }

    setApiLoading(true);
    try {
      for (const college of selectedColleges) {
        await addDoc(collection(db, 'colleges'), {
          ...college,
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser.uid,
          source: 'API Import'
        });
      }
      
      logSuccess('ADMIN', 'Colleges imported successfully', { 
        count: selectedColleges.length 
      });
      
      alert(`Successfully imported ${selectedColleges.length} college(s)!`);
      
      // Reset and close modal
      setShowCollegeImportModal(false);
      setCollegeSearchResults([]);
      setSelectedColleges([]);
      setCollegeSearchTerm('');
      fetchColleges();
    } catch (error) {
      logError('ADMIN', 'Failed to import colleges', { error: error.message });
      alert('Failed to import colleges. Please try again.');
    } finally {
      setApiLoading(false);
    }
  };

  // AI Question Generation Functions
  const handleGenerateQuestions = async () => {
    setAiLoading(true);
    try {
      const questions = await generateQuestions(
        aiGenerationConfig.category,
        aiGenerationConfig.count,
        aiGenerationConfig.difficulty
      );
      
      setGeneratedQuestions(questions);
      logInfo('ADMIN', 'AI questions generated', { 
        category: aiGenerationConfig.category,
        difficulty: aiGenerationConfig.difficulty,
        count: questions.length 
      });
    } catch (error) {
      logError('ADMIN', 'AI generation failed', { error: error.message });
      alert('Failed to generate questions. Please check your API key and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveGeneratedQuestions = async () => {
    if (generatedQuestions.length === 0) return;

    setAiLoading(true);
    try {
      for (const question of generatedQuestions) {
        await addDoc(collection(db, 'questions'), {
          ...question,
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser.uid,
          source: 'AI Generated'
        });
      }
      
      logSuccess('ADMIN', 'Generated questions saved', { 
        count: generatedQuestions.length 
      });
      
      alert(`Successfully saved ${generatedQuestions.length} question(s)!`);
      
      // Reset and close modal
      setShowAIGenerateModal(false);
      setGeneratedQuestions([]);
      fetchQuestions();
    } catch (error) {
      logError('ADMIN', 'Failed to save generated questions', { error: error.message });
      alert('Failed to save questions. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'colleges' ? 'tab-active' : ''}`}
            onClick={() => {
              setActiveTab('colleges');
              setShowForm(false);
            }}
          >
            Colleges Management
          </button>
          <button
            className={`tab ${activeTab === 'questions' ? 'tab-active' : ''}`}
            onClick={() => {
              setActiveTab('questions');
              setShowForm(false);
            }}
          >
            Aptitude Questions
          </button>
        </div>

        {/* Colleges Tab */}
        {activeTab === 'colleges' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Colleges ({colleges.length})</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : '+ Add Manually'}
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => setShowCollegeImportModal(true)}
                  style={{ backgroundColor: '#10b981' }}
                >
                  🌐 Import from API
                </button>
              </div>
            </div>

            {showForm && (
              <div className="card form-card">
                <h3>{editingCollege ? 'Edit College' : 'Add New College'}</h3>
                <form onSubmit={editingCollege ? handleUpdateCollege : handleAddCollege}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">College Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={collegeForm.name}
                        onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location *</label>
                      <select
                        className="form-select"
                        value={collegeForm.location}
                        onChange={(e) => setCollegeForm({ ...collegeForm, location: e.target.value })}
                        required
                      >
                        <option value="">Select Location</option>
                        <option value="India">India</option>
                        <option value="Abroad">Abroad</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Type *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Engineering, Management"
                        value={collegeForm.type}
                        onChange={(e) => setCollegeForm({ ...collegeForm, type: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Fees (₹/year) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={collegeForm.fees}
                        onChange={(e) => setCollegeForm({ ...collegeForm, fees: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ranking *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={collegeForm.ranking}
                        onChange={(e) => setCollegeForm({ ...collegeForm, ranking: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Min CGPA *</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        value={collegeForm.minCGPA}
                        onChange={(e) => setCollegeForm({ ...collegeForm, minCGPA: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Placement Rate (%) *</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        value={collegeForm.placementRate}
                        onChange={(e) => setCollegeForm({ ...collegeForm, placementRate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      value={collegeForm.description}
                      onChange={(e) => setCollegeForm({ ...collegeForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Facilities</label>
                    <textarea
                      className="form-textarea"
                      rows="2"
                      placeholder="e.g., Library, Hostel, Sports Complex"
                      value={collegeForm.facilities}
                      onChange={(e) => setCollegeForm({ ...collegeForm, facilities: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Scholarships</label>
                    <textarea
                      className="form-textarea"
                      rows="2"
                      placeholder="e.g., Merit-based, Need-based"
                      value={collegeForm.scholarships}
                      onChange={(e) => setCollegeForm({ ...collegeForm, scholarships: e.target.value })}
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {editingCollege && (
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => {
                          setEditingCollege(null);
                          setShowForm(false);
                          setCollegeForm({
                            name: '',
                            location: '',
                            type: '',
                            fees: '',
                            ranking: '',
                            minCGPA: '',
                            placementRate: '',
                            description: '',
                            facilities: '',
                            scholarships: ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn btn-success" disabled={loading} style={{ flex: 1 }}>
                      {loading ? (editingCollege ? 'Updating...' : 'Adding...') : (editingCollege ? 'Update College' : 'Add College')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && <div className="spinner"></div>}

            <div className="grid grid-2">
              {colleges.map(college => (
                <div key={college.id} className="card">
                  <div className="card-header">
                    <h3>{college.name}</h3>
                  </div>
                  <div className="card-body">
                    <p><strong>Location:</strong> {college.location}</p>
                    <p><strong>Type:</strong> {college.type}</p>
                    <p><strong>Fees:</strong> ₹{college.fees?.toLocaleString()}/year</p>
                    <p><strong>Ranking:</strong> {college.ranking}</p>
                    <p><strong>Min CGPA:</strong> {college.minCGPA}</p>
                    <p><strong>Placement:</strong> {college.placementRate}%</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEditCollege(college)}
                        style={{ flex: 1 }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteCollege(college.id, college.name)}
                        style={{ flex: 1 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Aptitude Questions ({questions.length})</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : '+ Add Manually'}
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => setShowAIGenerateModal(true)}
                  disabled={!geminiAvailable}
                  style={{ backgroundColor: geminiAvailable ? '#8b5cf6' : '#9ca3af' }}
                  title={!geminiAvailable ? 'Add VITE_GEMINI_API_KEY to .env file' : ''}
                >
                  ✨ Generate with AI
                </button>
              </div>
            </div>

            {showForm && (
              <div className="card form-card">
                <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
                <form onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion}>
                  <div className="form-group">
                    <label className="form-label">Question *</label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        value={questionForm.category}
                        onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                        required
                      >
                        <optgroup label="Aptitude Tests">
                          <option value="verbal">Verbal Reasoning</option>
                          <option value="quantitative">Quantitative Aptitude</option>
                          <option value="general">General Knowledge</option>
                        </optgroup>
                        <optgroup label="Career-Specific">
                          <option value="engineering">Engineering</option>
                          <option value="management">Management</option>
                          <option value="medical">Medical</option>
                          <option value="law">Law</option>
                          <option value="science">Science</option>
                          <option value="arts">Arts</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Difficulty *</label>
                      <select
                        className="form-select"
                        value={questionForm.difficulty}
                        onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                        required
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {[0, 1, 2, 3].map(index => (
                    <div key={index} className="form-group">
                      <label className="form-label">Option {index + 1} *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={questionForm.options[index]}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }}
                        required
                      />
                    </div>
                  ))}

                  <div className="form-group">
                    <label className="form-label">Correct Answer *</label>
                    <select
                      className="form-select"
                      value={questionForm.correctAnswer}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: parseInt(e.target.value) })}
                      required
                    >
                      <option value={0}>Option 1</option>
                      <option value={1}>Option 2</option>
                      <option value={2}>Option 3</option>
                      <option value={3}>Option 4</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {editingQuestion && (
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => {
                          setEditingQuestion(null);
                          setShowForm(false);
                          setQuestionForm({
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: 0,
                            category: 'verbal',
                            difficulty: 'medium'
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn btn-success" disabled={loading} style={{ flex: 1 }}>
                      {loading ? (editingQuestion ? 'Updating...' : 'Adding...') : (editingQuestion ? 'Update Question' : 'Add Question')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && <div className="spinner"></div>}

            {/* Category Filter */}
            <div className="category-filter" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Filter by Category</h3>
              <div className="category-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  className={`btn ${selectedQuestionCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('all')}
                  style={{ minWidth: '120px' }}
                >
                  All Questions ({questions.length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'quantitative' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('quantitative')}
                  style={{ minWidth: '150px' }}
                >
                  Quantitative ({questions.filter(q => q.category === 'quantitative').length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'verbal' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('verbal')}
                  style={{ minWidth: '150px' }}
                >
                  Verbal Reasoning ({questions.filter(q => q.category === 'verbal').length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'general' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('general')}
                  style={{ minWidth: '180px' }}
                >
                  General Knowledge ({questions.filter(q => q.category === 'general').length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'engineering' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('engineering')}
                  style={{ minWidth: '120px' }}
                >
                  Engineering ({questions.filter(q => q.category === 'engineering').length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'management' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('management')}
                  style={{ minWidth: '130px' }}
                >
                  Management ({questions.filter(q => q.category === 'management').length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'medical' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('medical')}
                  style={{ minWidth: '100px' }}
                >
                  Medical ({questions.filter(q => q.category === 'medical').length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'law' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('law')}
                  style={{ minWidth: '80px' }}
                >
                  Law ({questions.filter(q => q.category === 'law').length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'science' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('science')}
                  style={{ minWidth: '100px' }}
                >
                  Science ({questions.filter(q => q.category === 'science').length})
                </button>
                <button
                  className={`btn ${selectedQuestionCategory === 'arts' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedQuestionCategory('arts')}
                  style={{ minWidth: '80px' }}
                >
                  Arts ({questions.filter(q => q.category === 'arts').length})
                </button>
              </div>
            </div>

            <div className="questions-list">
              {questions
                .filter(q => selectedQuestionCategory === 'all' || q.category === selectedQuestionCategory)
                .map((q, idx) => (
                <div key={q.id} className="card">
                  <div className="question-header">
                    <span className="question-number">Q{idx + 1}</span>
                    <span className={`badge badge-${q.category}`}>{q.category}</span>
                    <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                  </div>
                  <p className="question-text">{q.question}</p>
                  <ul className="options-list">
                    {q.options.map((option, i) => (
                      <li key={i} className={i === q.correctAnswer ? 'correct-option' : ''}>
                        {option} {i === q.correctAnswer && '✓'}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditQuestion(q)}
                      style={{ flex: 1 }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteQuestion(q.id)}
                      style={{ flex: 1 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* College Import Modal */}
        {showCollegeImportModal && (
          <div className="modal-overlay" onClick={() => setShowCollegeImportModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Import Colleges from API</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowCollegeImportModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="search-section">
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select
                      className="form-select"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      {getAvailableCountries().map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search colleges (e.g., 'Technology', 'Engineering', 'MIT')"
                      value={collegeSearchTerm}
                      onChange={(e) => setCollegeSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchColleges()}
                    />
                    <button 
                      className="search-btn"
                      onClick={handleSearchColleges}
                      disabled={apiLoading}
                    >
                      {apiLoading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </div>

                {collegeSearchResults.length > 0 && (
                  <>
                    <div className="results-header">
                      <p>Found {collegeSearchResults.length} colleges</p>
                      <p>{selectedColleges.length} selected</p>
                    </div>
                    
                    <div className="results-list">
                      {collegeSearchResults.map((college, idx) => {
                        const collegeId = college.web_pages?.[0] || college.name;
                        const isSelected = selectedColleges.some(c => 
                          (c.web_pages?.[0] || c.name) === collegeId
                        );
                        return (
                        <div 
                          key={idx}
                          className={`result-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleToggleCollegeSelection(college)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCollegeSelection(college)}
                          />
                          <div className="result-info">
                            <h4>{college.name}</h4>
                            <p>{college.location}</p>
                            <p className="result-meta">
                              <span>{college.type}</span>
                              <span>₹{college.fees?.toLocaleString() || 'N/A'}/year</span>
                            </p>
                          </div>
                        </div>
                      );
                      })}
                    </div>
                  </>
                )}
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowCollegeImportModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-success"
                  onClick={handleImportSelectedColleges}
                  disabled={selectedColleges.length === 0 || apiLoading}
                >
                  {apiLoading ? 'Importing...' : `Import ${selectedColleges.length} College(s)`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Question Generation Modal */}
        {showAIGenerateModal && (
          <div className="modal-overlay" onClick={() => setShowAIGenerateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Generate Questions with AI</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowAIGenerateModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="generation-config">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={aiGenerationConfig.category}
                      onChange={(e) => setAiGenerationConfig({...aiGenerationConfig, category: e.target.value})}
                    >
                      <optgroup label="Aptitude Tests">
                        <option value="verbal">Verbal Reasoning</option>
                        <option value="quantitative">Quantitative Aptitude</option>
                        <option value="general">General Knowledge</option>
                      </optgroup>
                      <optgroup label="Career-Specific">
                        <option value="engineering">Engineering</option>
                        <option value="management">Management</option>
                        <option value="medical">Medical</option>
                        <option value="law">Law</option>
                        <option value="science">Science</option>
                        <option value="arts">Arts</option>
                      </optgroup>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-select"
                      value={aiGenerationConfig.difficulty}
                      onChange={(e) => setAiGenerationConfig({...aiGenerationConfig, difficulty: e.target.value})}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Number of Questions</label>
                    <input
                      type="number"
                      className="form-input"
                      min="5"
                      max="50"
                      value={aiGenerationConfig.count}
                      onChange={(e) => setAiGenerationConfig({...aiGenerationConfig, count: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={handleGenerateQuestions}
                    disabled={aiLoading}
                    style={{ width: '100%' }}
                  >
                    {aiLoading ? 'Generating...' : 'Generate Questions'}
                  </button>
                </div>

                {generatedQuestions.length > 0 && (
                  <>
                    <div className="generation-stats">
                      <p>✨ Generated {generatedQuestions.length} questions successfully!</p>
                    </div>
                    
                    <div className="question-preview-list">
                      {generatedQuestions.slice(0, 3).map((q, idx) => (
                        <div key={idx} className="question-preview">
                          <div className="question-preview-header">
                            <span className="question-number">Q{idx + 1}</span>
                            <span className={`badge badge-${q.category}`}>{q.category}</span>
                            <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                          </div>
                          <p className="question-text">{q.question}</p>
                          <ul className="options-list">
                            {q.options.map((option, i) => (
                              <li key={i} className={i === q.correctAnswer ? 'correct-option' : ''}>
                                {option} {i === q.correctAnswer && '✓'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {generatedQuestions.length > 3 && (
                        <p className="preview-note">
                          ... and {generatedQuestions.length - 3} more questions
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowAIGenerateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-success"
                  onClick={handleSaveGeneratedQuestions}
                  disabled={generatedQuestions.length === 0 || aiLoading}
                >
                  {aiLoading ? 'Saving...' : `Save ${generatedQuestions.length} Question(s)`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
