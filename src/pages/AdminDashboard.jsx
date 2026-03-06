import React, { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { logInfo, logError, logSuccess } from '../logger';
import { generateQuestions, isGeminiAvailable } from '../services/geminiAPI';
import { 
  getAvailableCountries, 
  searchColleges, 
  fetchCollegesByCountry,
  fetchWorldwideColleges 
} from '../services/collegeAPI';
import addSampleColleges from '../utils/addSampleColleges';
import { 
  GraduationCapIcon, 
  DocumentIcon, 
  FileTextIcon,
  EditIcon, 
  TrashIcon, 
  CheckIcon, 
  CloseIcon,
  TrophyIcon, 
  LocationIcon, 
  MoneyIcon, 
  ChartIcon,
  PhoneIcon, 
  MailIcon, 
  GlobeIcon, 
  LinkIcon,
  ClockIcon,
  PlusIcon,
  DownloadIcon,
  BuildingIcon,
  BookOpenIcon,
  AwardIcon,
  SearchIcon
} from '../components/Icons';
import './AdminDashboard.css';
import '../components/Modals.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('colleges');
  const [colleges, setColleges] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [applications, setApplications] = useState([]);
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

  // Admin college search
  const [adminCollegeSearch, setAdminCollegeSearch] = useState('');

  // College form state
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    country: 'India',
    state: '',
    city: '',
    address: '',
    types: [],
    type: '',
    fees: '',
    currency: 'INR',
    ranking: '',
    minCGPA: '',
    placementRate: '',
    requiredExam: 'None',
    minimumExamScore: '',
    description: '',
    facilities: '',
    scholarships: '',
    website: '',
    email: '',
    phone: '',
    establishedYear: '',
    accreditation: '',
    coursesOffered: '',
    campusSize: '',
    studentCount: '',
    facultyCount: ''
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
    console.log('Active tab changed to:', activeTab);
    
    // Verify admin user and role
    const verifyUserRole = async () => {
      if (auth.currentUser) {
        console.log('Current user ID:', auth.currentUser.uid);
        console.log('Current user email:', auth.currentUser.email);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            console.log('User role from Firestore:', userDoc.data().role);
            console.log('Full user data:', userDoc.data());
          } else {
            console.error('User document does not exist in Firestore!');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };
    
    verifyUserRole();
    
    if (activeTab === 'colleges') {
      fetchColleges();
    } else if (activeTab === 'questions') {
      fetchQuestions();
    } else if (activeTab === 'applications') {
      console.log('Tab is applications, fetching...');
      fetchApplications();
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

  const fetchApplications = async () => {
    setLoading(true);
    try {
      console.log('Fetching applications from Firestore...');
      const querySnapshot = await getDocs(collection(db, 'applications'));
      console.log('Applications query result:', querySnapshot.docs.length, 'documents');
      
      const appsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate()
      }));
      
      console.log('Applications data:', appsData);
      console.table(appsData.map(app => ({
        id: app.id,
        studentName: app.studentName,
        collegeName: app.collegeName,
        status: app.status,
        appliedAt: app.appliedAt
      })));
      
      // Sort by most recent first
      appsData.sort((a, b) => b.appliedAt - a.appliedAt);
      setApplications(appsData);
      logInfo('ADMIN', 'Applications fetched', { count: appsData.length });
    } catch (error) {
      console.error('Error fetching applications:', error);
      logError('ADMIN', 'Failed to fetch applications', { 
        error: error.message,
        code: error.code,
        details: error
      });
      alert(`Failed to fetch applications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetCollegeForm = () => {
    setCollegeForm({
      name: '',
      country: 'India',
      state: '',
      city: '',
      address: '',
      types: [],
      type: '',
      fees: '',
      currency: 'INR',
      ranking: '',
      minCGPA: '',
      placementRate: '',
      requiredExam: 'None',
      minimumExamScore: '',
      description: '',
      facilities: '',
      scholarships: '',
      website: '',
      email: '',
      phone: '',
      establishedYear: '',
      accreditation: '',
      coursesOffered: '',
      campusSize: '',
      studentCount: '',
      facultyCount: ''
    });
  };

  const handleUpdateApplicationStatus = async (applicationId, status, remarks = '') => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: status,
        adminRemarks: remarks,
        updatedAt: serverTimestamp(),
        reviewedBy: auth.currentUser.uid
      });
      logSuccess('ADMIN', 'Application status updated', { applicationId, status });
      fetchApplications(); // Refresh
      alert(`Application ${status} successfully!`);
    } catch (error) {
      logError('ADMIN', 'Failed to update application status', { error: error.message });
      alert('Failed to update application status. Please try again.');
    }
  };

  const handleAddCollege = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const primaryType = (collegeForm.types && collegeForm.types.length > 0) ? collegeForm.types[0] : (collegeForm.type || '');
      const collegeData = {
        ...collegeForm,
        type: primaryType,
        types: collegeForm.types && collegeForm.types.length > 0 ? collegeForm.types : (collegeForm.type ? [collegeForm.type] : []),
        fees: parseFloat(collegeForm.fees) || 0,
        ranking: parseInt(collegeForm.ranking) || 0,
        minCGPA: parseFloat(collegeForm.minCGPA) || 0,
        placementRate: parseFloat(collegeForm.placementRate) || 0,
        requiredExam: collegeForm.requiredExam || 'None',
        minimumExamScore: parseFloat(collegeForm.minimumExamScore) || 0,
        establishedYear: collegeForm.establishedYear ? parseInt(collegeForm.establishedYear) : null,
        studentCount: collegeForm.studentCount ? parseInt(collegeForm.studentCount) : null,
        facultyCount: collegeForm.facultyCount ? parseInt(collegeForm.facultyCount) : null,
        location: `${collegeForm.city}, ${collegeForm.state}, ${collegeForm.country}`.replace(/^,\s*|,\s*,/g, ',').replace(/^,|,$/g, '').trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      };

      await addDoc(collection(db, 'colleges'), collegeData);
      logSuccess('ADMIN', 'College added successfully', { collegeName: collegeForm.name });
      
      resetCollegeForm();
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
    console.log('Editing college - Full object:', college);
    console.log('State value:', college.state);
    console.log('City value:', college.city);
    console.log('Country value:', college.country);
    
    setEditingCollege(college.id);
    
    // Prepare form with all college data
    const formData = {
      name: college.name || '',
      country: college.country || 'India',
      state: college.state || '',
      city: college.city || '',
      address: college.address || '',
      types: college.types && college.types.length > 0 ? college.types : (college.type ? [college.type] : []),
      type: college.type || '',
      fees: college.fees?.toString() || '',
      currency: college.currency || 'INR',
      ranking: college.ranking?.toString() || '',
      minCGPA: college.minCGPA?.toString() || '',
      placementRate: college.placementRate?.toString() || '',
      requiredExam: college.requiredExam || 'None',
      minimumExamScore: college.minimumExamScore?.toString() || '',
      description: college.description || '',
      facilities: college.facilities || '',
      scholarships: college.scholarships || '',
      website: college.website || '',
      email: college.email || '',
      phone: college.phone || '',
      establishedYear: college.establishedYear?.toString() || '',
      accreditation: college.accreditation || '',
      coursesOffered: college.coursesOffered || '',
      campusSize: college.campusSize || '',
      studentCount: college.studentCount?.toString() || '',
      facultyCount: college.facultyCount?.toString() || ''
    };
    
    console.log('Form data being set:', formData);
    setCollegeForm(formData);
    setShowForm(true);
    
    // Show notification
    logInfo('ADMIN', 'Editing college', { collegeId: college.id, collegeName: college.name });
    
    // Scroll to top of the page to see the form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleUpdateCollege = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const primaryTypeU = (collegeForm.types && collegeForm.types.length > 0) ? collegeForm.types[0] : (collegeForm.type || '');
      const collegeData = {
        ...collegeForm,
        type: primaryTypeU,
        types: collegeForm.types && collegeForm.types.length > 0 ? collegeForm.types : (collegeForm.type ? [collegeForm.type] : []),
        fees: parseFloat(collegeForm.fees) || 0,
        ranking: parseInt(collegeForm.ranking) || 0,
        minCGPA: parseFloat(collegeForm.minCGPA) || 0,
        placementRate: parseFloat(collegeForm.placementRate) || 0,
        requiredExam: collegeForm.requiredExam || 'None',
        minimumExamScore: parseFloat(collegeForm.minimumExamScore) || 0,
        establishedYear: collegeForm.establishedYear ? parseInt(collegeForm.establishedYear) : null,
        studentCount: collegeForm.studentCount ? parseInt(collegeForm.studentCount) : null,
        facultyCount: collegeForm.facultyCount ? parseInt(collegeForm.facultyCount) : null,
        location: `${collegeForm.city}, ${collegeForm.state}, ${collegeForm.country}`.replace(/^,\s*|,\s*,/g, ',').replace(/^,|,$/g, '').trim(),
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser.uid
      };

      await updateDoc(doc(db, 'colleges', editingCollege), collegeData);
      logSuccess('ADMIN', 'College updated successfully', { collegeId: editingCollege, collegeName: collegeForm.name });
      
      resetCollegeForm();
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
    setApiLoading(true);
    try {
      let results;
      if (collegeSearchTerm.trim()) {
        // Search with term
        results = await searchColleges(collegeSearchTerm, selectedCountry);
      } else {
        // Fetch all colleges from selected country
        results = await fetchCollegesByCountry(selectedCountry, 50);
      }
      
      setCollegeSearchResults(results);
      logInfo('ADMIN', 'College search completed', { 
        searchTerm: collegeSearchTerm || 'all', 
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

  const handleBulkImportWorldwide = async () => {
    const confirmed = window.confirm(
      'This will fetch and import colleges from 16 major countries worldwide (up to 480 colleges). This may take a few minutes. Continue?'
    );
    
    if (!confirmed) return;

    setApiLoading(true);
    try {
      const colleges = await fetchWorldwideColleges();
      
      // Use batch writes for better performance
      const batch = writeBatch(db);
      colleges.forEach(college => {
        const docRef = doc(collection(db, 'colleges'));
        batch.set(docRef, {
          ...college,
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser.uid,
          source: 'Worldwide Import'
        });
      });
      
      await batch.commit();
      
      logSuccess('ADMIN', 'Worldwide colleges imported', { count: colleges.length });
      alert(`Successfully imported ${colleges.length} colleges from around the world!`);
      
      setShowCollegeImportModal(false);
      fetchColleges();
    } catch (error) {
      logError('ADMIN', 'Worldwide import failed', { error: error.message });
      alert('Failed to import worldwide colleges. Please try again.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleAddSampleColleges = async () => {
    const confirmed = window.confirm(
      'This will add 15 sample colleges from India covering Engineering, Management, Medical, Law, Science, and Arts programs. Continue?'
    );
    
    if (!confirmed) return;

    setApiLoading(true);
    try {
      const result = await addSampleColleges();
      
      logSuccess('ADMIN', 'Sample colleges added', { 
        successCount: result.successCount,
        errorCount: result.errorCount 
      });
      
      alert(`Successfully added ${result.successCount} sample colleges!${result.errorCount > 0 ? `\n${result.errorCount} failed to add.` : ''}`);
      
      fetchColleges();
    } catch (error) {
      logError('ADMIN', 'Failed to add sample colleges', { error: error.message });
      alert('Failed to add sample colleges. Please check console for details.');
      console.error('Sample colleges error:', error);
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
          <button
            className={`tab ${activeTab === 'applications' ? 'tab-active' : ''}`}
            onClick={() => {
              setActiveTab('applications');
              setShowForm(false);
            }}
          >
            Applications ({applications.length})
          </button>
        </div>

        {/* Colleges Tab */}
        {activeTab === 'colleges' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Colleges ({colleges.length})</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : '+ Add Manually'}
                </button>
                <button
                  className="btn btn-info"
                  onClick={handleAddSampleColleges}
                  style={{ backgroundColor: '#3b82f6' }}
                  disabled={apiLoading}
                >
                  <PlusIcon size={18} /> Add Sample Colleges
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => setShowCollegeImportModal(true)}
                  style={{ backgroundColor: '#10b981' }}
                  disabled={apiLoading}
                >
                  <GlobeIcon size={18} /> Import from API
                </button>
              </div>
            </div>

            {showForm && (
              <div className="card form-card" style={{ 
                border: editingCollege ? '3px solid #3b82f6' : '1px solid #e5e7eb',
                boxShadow: editingCollege ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'var(--shadow-md)'
              }}>
                <div style={{ 
                  background: editingCollege ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  margin: '-1.5rem -1.5rem 1.5rem',
                  borderRadius: '0.75rem 0.75rem 0 0'
                }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem' }}>
                    {editingCollege ? (
                      <><EditIcon size={24} /> Editing College</>
                    ) : (
                      <><GraduationCapIcon size={24} /> Add New College</>
                    )}
                  </h3>
                  {editingCollege && (
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                      Update the information below and click "Update College"
                    </p>
                  )}
                </div>
                <form onSubmit={editingCollege ? handleUpdateCollege : handleAddCollege}>
                  
                  {/* Basic Information Section */}
                  <div className="form-section">
                    <h4 className="section-title">
                      <FileTextIcon size={18} /> Basic Information
                    </h4>
                    <div className="grid grid-3">
                      <div className="form-group">
                        <label className="form-label">College Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={collegeForm.name}
                          onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                          placeholder="e.g., Massachusetts Institute of Technology"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Type(s) * <span style={{fontSize:'0.75rem',fontWeight:400,color:'#6b7280'}}>(select all that apply)</span></label>
                        <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',padding:'0.5rem',border:'1px solid #d1d5db',borderRadius:'0.5rem',background:'#fff'}}>
                          {['Engineering','Management','Medical','Law','Science','Arts','Commerce','Design','Media','Agriculture','Pharmacy','Technology','Other'].map(t => {
                            const checked = (collegeForm.types || []).includes(t);
                            return (
                              <label key={t} style={{display:'flex',alignItems:'center',gap:'0.35rem',padding:'0.3rem 0.7rem',borderRadius:'2rem',border:`1.5px solid ${checked ? '#3b82f6' : '#e5e7eb'}`,background: checked ? '#eff6ff' : '#f9fafb',cursor:'pointer',fontSize:'0.82rem',fontWeight: checked ? 600 : 400,color: checked ? '#1d4ed8' : '#374151',transition:'all 0.15s'}}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  style={{display:'none'}}
                                  onChange={() => {
                                    const cur = collegeForm.types || [];
                                    setCollegeForm({...collegeForm, types: checked ? cur.filter(x => x !== t) : [...cur, t]});
                                  }}
                                />
                                {checked ? '✓ ' : ''}{t}
                              </label>
                            );
                          })}
                        </div>
                        {(collegeForm.types || []).length === 0 && <p style={{fontSize:'0.75rem',color:'#ef4444',marginTop:'0.25rem'}}>Please select at least one type</p>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Established Year</label>
                        <input
                          type="number"
                          className="form-input"
                          value={collegeForm.establishedYear}
                          onChange={(e) => setCollegeForm({ ...collegeForm, establishedYear: e.target.value })}
                          placeholder="e.g., 1861"
                          min="1500"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Details Section */}
                  <div className="form-section">
                    <h4 className="section-title">
                      <LocationIcon size={18} /> Location Details
                    </h4>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Country *</label>
                        <select
                          className="form-select"
                          value={collegeForm.country}
                          onChange={(e) => setCollegeForm({ ...collegeForm, country: e.target.value })}
                          required
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="China">China</option>
                          <option value="Japan">Japan</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="Switzerland">Switzerland</option>
                          <option value="South Korea">South Korea</option>
                          <option value="New Zealand">New Zealand</option>
                          <option value="Ireland">Ireland</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">State/Province *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={collegeForm.state}
                          onChange={(e) => setCollegeForm({ ...collegeForm, state: e.target.value })}
                          placeholder="e.g., Maharashtra, California"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={collegeForm.city}
                          onChange={(e) => setCollegeForm({ ...collegeForm, city: e.target.value })}
                          placeholder="e.g., Mumbai, Cambridge"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-input"
                          value={collegeForm.address}
                          onChange={(e) => setCollegeForm({ ...collegeForm, address: e.target.value })}
                          placeholder="Complete address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="form-section">
                    <h4 className="section-title">
                      <PhoneIcon size={18} /> Contact Information
                    </h4>
                    <div className="grid grid-3">
                      <div className="form-group">
                        <label className="form-label">Website</label>
                        <input
                          type="url"
                          className="form-input"
                          value={collegeForm.website}
                          onChange={(e) => setCollegeForm({ ...collegeForm, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-input"
                          value={collegeForm.email}
                          onChange={(e) => setCollegeForm({ ...collegeForm, email: e.target.value })}
                          placeholder="admissions@example.com"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={collegeForm.phone}
                          onChange={(e) => setCollegeForm({ ...collegeForm, phone: e.target.value })}
                          placeholder="+1-123-456-7890"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information Section */}
                  <div className="form-section">
                    <h4 className="section-title">
                      <GraduationCapIcon size={18} /> Academic Information
                    </h4>
                    <div className="grid grid-2">
                      <div className="form-group">
                        <label className="form-label">Fees/Year *</label>
                        <div className="input-with-select">
                          <select
                            className="form-select currency-select"
                            value={collegeForm.currency}
                            onChange={(e) => setCollegeForm({ ...collegeForm, currency: e.target.value })}
                            style={{ width: '100px', marginRight: '0.5rem' }}
                          >
                            <option value="INR">₹ INR</option>
                            <option value="USD">$ USD</option>
                            <option value="EUR">€ EUR</option>
                            <option value="GBP">£ GBP</option>
                            <option value="AUD">A$ AUD</option>
                            <option value="CAD">C$ CAD</option>
                          </select>
                          <input
                            type="number"
                            className="form-input"
                            value={collegeForm.fees}
                            onChange={(e) => setCollegeForm({ ...collegeForm, fees: e.target.value })}
                            placeholder="50000"
                            required
                            style={{ flex: 1 }}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">World/National Ranking</label>
                        <input
                          type="number"
                          className="form-input"
                          value={collegeForm.ranking}
                          onChange={(e) => setCollegeForm({ ...collegeForm, ranking: e.target.value })}
                          placeholder="e.g., 1, 50, 100"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Min CGPA Required *</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input"
                          value={collegeForm.minCGPA}
                          onChange={(e) => setCollegeForm({ ...collegeForm, minCGPA: e.target.value })}
                          placeholder="e.g., 7.5"
                          min="0"
                          max="10"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Placement Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-input"
                          value={collegeForm.placementRate}
                          onChange={(e) => setCollegeForm({ ...collegeForm, placementRate: e.target.value })}
                          placeholder="e.g., 95.5"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Required Entrance Exam</label>
                        <select
                          className="form-select"
                          value={collegeForm.requiredExam}
                          onChange={(e) => setCollegeForm({ ...collegeForm, requiredExam: e.target.value })}
                        >
                          <option value="None">None / No entrance exam</option>
                          <option value="JEE">JEE (percentile)</option>
                          <option value="NEET">NEET (marks out of 720)</option>
                          <option value="CAT">CAT (percentile)</option>
                          <option value="GMAT">GMAT (score 200–800)</option>
                        </select>
                      </div>

                      {collegeForm.requiredExam && collegeForm.requiredExam !== 'None' && (
                        <div className="form-group">
                          <label className="form-label">Minimum Exam Score</label>
                          <input
                            type="number"
                            step="1"
                            className="form-input"
                            value={collegeForm.minimumExamScore}
                            onChange={(e) => setCollegeForm({ ...collegeForm, minimumExamScore: e.target.value })}
                            placeholder={collegeForm.requiredExam === 'NEET' ? 'e.g., 600' : 'e.g., 95'}
                            min="0"
                          />
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label">Accreditation</label>
                        <input
                          type="text"
                          className="form-input"
                          value={collegeForm.accreditation}
                          onChange={(e) => setCollegeForm({ ...collegeForm, accreditation: e.target.value })}
                          placeholder="e.g., NAAC A++, ABET"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Courses Offered</label>
                      <textarea
                        className="form-textarea"
                        rows="2"
                        value={collegeForm.coursesOffered}
                        onChange={(e) => setCollegeForm({ ...collegeForm, coursesOffered: e.target.value })}
                        placeholder="e.g., B.Tech in Computer Science, M.Tech in AI, MBA, etc."
                      ></textarea>
                    </div>
                  </div>

                  {/* Campus Statistics Section */}
                  <div className="form-section">
                    <h4 className="section-title">
                      <ChartIcon size={18} /> Campus Statistics
                    </h4>
                    <div className="grid grid-3">
                      <div className="form-group">
                        <label className="form-label">Campus Size</label>
                        <input
                          type="text"
                          className="form-input"
                          value={collegeForm.campusSize}
                          onChange={(e) => setCollegeForm({ ...collegeForm, campusSize: e.target.value })}
                          placeholder="e.g., 500 acres, 200 sq km"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Total Students</label>
                        <input
                          type="number"
                          className="form-input"
                          value={collegeForm.studentCount}
                          onChange={(e) => setCollegeForm({ ...collegeForm, studentCount: e.target.value })}
                          placeholder="e.g., 10000"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Faculty Count</label>
                        <input
                          type="number"
                          className="form-input"
                          value={collegeForm.facultyCount}
                          onChange={(e) => setCollegeForm({ ...collegeForm, facultyCount: e.target.value })}
                          placeholder="e.g., 500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details Section */}
                  <div className="form-section">
                    <h4 className="section-title">
                      <DocumentIcon size={18} /> Additional Details
                    </h4>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-textarea"
                        rows="3"
                        value={collegeForm.description}
                        onChange={(e) => setCollegeForm({ ...collegeForm, description: e.target.value })}
                        placeholder="Brief description about the college, its history, achievements, etc."
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Facilities</label>
                      <textarea
                        className="form-textarea"
                        rows="2"
                        placeholder="e.g., Library, Hostel, Sports Complex, Research Labs, Cafeteria"
                        value={collegeForm.facilities}
                        onChange={(e) => setCollegeForm({ ...collegeForm, facilities: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Scholarships</label>
                      <textarea
                        className="form-textarea"
                        rows="2"
                        placeholder="e.g., Merit-based scholarships, Need-based aid, Sports scholarships"
                        value={collegeForm.scholarships}
                        onChange={(e) => setCollegeForm({ ...collegeForm, scholarships: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #f0f0f0' }}>
                    {editingCollege && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingCollege(null);
                          setShowForm(false);
                          resetCollegeForm();
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn btn-success" disabled={loading} style={{ flex: 1 }}>
                      {loading ? (
                        <><ClockIcon size={18} /> {editingCollege ? 'Updating...' : 'Adding...'}</>
                      ) : (
                        <><CheckIcon size={18} /> {editingCollege ? 'Update College' : 'Add College'}</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && <div className="spinner"></div>}

            {/* Search bar */}
            <div style={{marginBottom:'1.25rem',position:'relative'}}>
              <span style={{position:'absolute',left:'0.875rem',top:'50%',transform:'translateY(-50%)',color:'#9ca3af',pointerEvents:'none',display:'flex',alignItems:'center'}}>
                <SearchIcon size={16} color="#9ca3af" />
              </span>
              <input
                type="text"
                className="form-input"
                style={{paddingLeft:'2.5rem',borderRadius:'0.625rem',border:'1.5px solid #e5e7eb',background:'#f9fafb'}}
                placeholder="Search colleges by name, type, city, state…"
                value={adminCollegeSearch}
                onChange={e => setAdminCollegeSearch(e.target.value)}
              />
              {adminCollegeSearch && (
                <button onClick={() => setAdminCollegeSearch('')} style={{position:'absolute',right:'0.875rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#6b7280',display:'flex',alignItems:'center'}}>
                  <CloseIcon size={14} color="#6b7280" />
                </button>
              )}
            </div>

            <div className="grid grid-2">
              {colleges.filter(college => {
                if (!adminCollegeSearch.trim()) return true;
                const q = adminCollegeSearch.toLowerCase();
                const allTypes = [...(college.types || []), college.type || ''].join(' ').toLowerCase();
                return (
                  (college.name || '').toLowerCase().includes(q) ||
                  (college.city || '').toLowerCase().includes(q) ||
                  (college.state || '').toLowerCase().includes(q) ||
                  (college.country || '').toLowerCase().includes(q) ||
                  allTypes.includes(q)
                );
              }).map(college => (
                <div key={college.id} className="card college-detail-card">
                  <div className="card-header">
                    <h3>{college.name}</h3>
                    {college.ranking && (
                      <span className="ranking-badge">
                        <TrophyIcon size={16} /> Rank #{college.ranking}
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="college-info-section">
                      <h4><LocationIcon size={16} /> Location</h4>
                      <p>{college.city && `${college.city}, `}{college.state && `${college.state}, `}{college.country || college.location}</p>
                    </div>

                    <div className="college-info-section">
                      <h4><GraduationCapIcon size={16} /> Academic Info</h4>
                      <div className="info-grid">
                        <p><strong>Type:</strong>{' '}
                          {(college.types && college.types.length > 0 ? college.types : (college.type ? [college.type] : [])).map(t => (
                            <span key={t} style={{display:'inline-block',background:'#eff6ff',color:'#1d4ed8',fontSize:'0.72rem',fontWeight:600,padding:'0.1rem 0.5rem',borderRadius:'0.25rem',marginRight:'0.25rem',marginBottom:'0.2rem'}}>{t}</span>
                          ))}
                        </p>
                        <p><strong>Min CGPA:</strong> {college.minCGPA}</p>
                        <p>
                          <strong>Entrance Exam:</strong>{' '}
                          {college.requiredExam && college.requiredExam !== 'None'
                            ? <span style={{background:'#1e40af',color:'#bfdbfe',fontSize:'0.72rem',fontWeight:600,padding:'0.1rem 0.5rem',borderRadius:'0.25rem'}}>
                                {college.requiredExam} ≥ {college.minimumExamScore}
                              </span>
                            : <span style={{color:'#6b7280',fontSize:'0.8rem'}}>None</span>
                          }
                        </p>
                        {college.establishedYear && (
                          <p><strong>Founded:</strong> {college.establishedYear}</p>
                        )}
                        {college.accreditation && (
                          <p><strong>Accreditation:</strong> {college.accreditation}</p>
                        )}
                      </div>
                    </div>

                    <div className="college-info-section">
                      <h4><MoneyIcon size={16} /> Financial Info</h4>
                      <p>
                        <strong>Fees:</strong> 
                        {college.currency === 'USD' && ' $'}
                        {college.currency === 'EUR' && ' €'}
                        {college.currency === 'GBP' && ' £'}
                        {college.currency === 'INR' && ' ₹'}
                        {college.currency === 'AUD' && ' A$'}
                        {college.currency === 'CAD' && ' C$'}
                        {!college.currency && ' ₹'}
                        {college.fees?.toLocaleString()}/year
                      </p>
                      {college.scholarships && (
                        <p><strong>Scholarships:</strong> Available</p>
                      )}
                    </div>

                    {(college.studentCount || college.facultyCount || college.placementRate) && (
                      <div className="college-info-section">
                        <h4><ChartIcon size={16} /> Statistics</h4>
                        <div className="info-grid">
                          {college.placementRate && (
                            <p><strong>Placement:</strong> {college.placementRate}%</p>
                          )}
                          {college.studentCount && (
                            <p><strong>Students:</strong> {college.studentCount.toLocaleString()}</p>
                          )}
                          {college.facultyCount && (
                            <p><strong>Faculty:</strong> {college.facultyCount.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {(college.website || college.email || college.phone) && (
                      <div className="college-info-section">
                        <h4><PhoneIcon size={16} /> Contact</h4>
                        {college.website && (
                          <p>
                            <strong>Website:</strong>{' '}
                            <a href={college.website} target="_blank" rel="noopener noreferrer" className="college-link">
                              Visit Website
                            </a>
                          </p>
                        )}
                        {college.email && <p><strong>Email:</strong> {college.email}</p>}
                        {college.phone && <p><strong>Phone:</strong> {college.phone}</p>}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e5e7eb' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEditCollege(college)}
                        style={{ flex: 1, fontSize: '0.95rem', padding: '0.75rem 1rem' }}
                      >
                        <EditIcon size={18} /> Edit College
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteCollege(college.id, college.name)}
                        style={{ flex: 1, fontSize: '0.95rem', padding: '0.75rem 1rem' }}
                      >
                        <TrashIcon size={18} /> Delete
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
                        {option} {i === q.correctAnswer && <CheckIcon size={16} style={{ color: '#10b981', marginLeft: '0.5rem' }} />}
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

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Student Applications ({applications.length})</h2>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  console.log('Manual refresh clicked');
                  fetchApplications();
                }}
              >
                🔄 Refresh
              </button>
            </div>

            {loading && <div className="spinner"></div>}

            {/* Applications Statistics */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
              <div className="stat-card" style={{ background: '#fef3c7', padding: '1.5rem', borderRadius: '12px' }}>
                <h3 style={{ color: '#92400e', fontSize: '2rem', margin: 0 }}>{applications.filter(a => a.status === 'pending').length}</h3>
                <p style={{ color: '#92400e', margin: '0.5rem 0 0 0' }}>Pending</p>
              </div>
              <div className="stat-card" style={{ background: '#d1fae5', padding: '1.5rem', borderRadius: '12px' }}>
                <h3 style={{ color: '#065f46', fontSize: '2rem', margin: 0 }}>{applications.filter(a => a.status === 'approved').length}</h3>
                <p style={{ color: '#065f46', margin: '0.5rem 0 0 0' }}>Approved</p>
              </div>
              <div className="stat-card" style={{ background: '#fee2e2', padding: '1.5rem', borderRadius: '12px' }}>
                <h3 style={{ color: '#991b1b', fontSize: '2rem', margin: 0 }}>{applications.filter(a => a.status === 'rejected').length}</h3>
                <p style={{ color: '#991b1b', margin: '0.5rem 0 0 0' }}>Rejected</p>
              </div>
            </div>

            {/* Applications List */}
            {applications.length > 0 ? (
              <div className="applications-admin-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {applications.map((app) => (
                  <div key={app.id} className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
                      <div>
                        <h3 style={{ color: '#2563eb', margin: 0, fontSize: '1.3rem' }}>{app.studentName}</h3>
                        <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                          Applied to: <strong>{app.collegeName}</strong>
                        </p>
                        <p style={{ color: '#718096', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                          {app.appliedAt?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <span 
                        className={`status-badge ${
                          app.status === 'approved' ? 'status-approved' : 
                          app.status === 'rejected' ? 'status-rejected' : 
                          'status-pending'
                        }`}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                      >
                        {app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                      </span>
                    </div>

                    <div className="application-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>Email</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600, margin: '0.25rem 0 0 0' }}>{app.studentEmail}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>Phone</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600, margin: '0.25rem 0 0 0' }}>{app.phone}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>CGPA</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600, margin: '0.25rem 0 0 0' }}>{app.cgpa}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>Test Score</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600, margin: '0.25rem 0 0 0' }}>{app.testScore}%</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>10th %</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600, margin: '0.25rem 0 0 0' }}>{app.tenthPercentage}%</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>12th %</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600, margin: '0.25rem 0 0 0' }}>{app.twelfthPercentage}%</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>Preferred Course</p>
                      <p style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 600, margin: '0.25rem 0 0 0' }}>{app.preferredCourse}</p>
                    </div>

                    {app.address && (
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>Address</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', margin: '0.25rem 0 0 0' }}>
                          {app.address}, {app.city}, {app.state} - {app.pincode}
                        </p>
                      </div>
                    )}

                    {app.remarks && (
                      <div style={{ background: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>Student Remarks</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', margin: '0.5rem 0 0 0' }}>{app.remarks}</p>
                      </div>
                    )}

                    {app.adminRemarks && (
                      <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid #10b981' }}>
                        <p style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, margin: 0 }}>Admin Remarks</p>
                        <p style={{ fontSize: '1rem', color: '#2d3748', margin: '0.5rem 0 0 0' }}>{app.adminRemarks}</p>
                      </div>
                    )}

                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            const remarks = prompt('Enter remarks for approval (optional):');
                            handleUpdateApplicationStatus(app.id, 'approved', remarks || 'Application approved');
                          }}
                          style={{ flex: 1 }}
                        >
                          <CheckIcon size={18} /> Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            const remarks = prompt('Enter reason for rejection:');
                            if (remarks) {
                              handleUpdateApplicationStatus(app.id, 'rejected', remarks);
                            } else {
                              alert('Please provide a reason for rejection');
                            }
                          }}
                          style={{ flex: 1 }}
                        >
                          <CloseIcon size={18} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '1rem' }}>
                    No applications found.
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#a0aec0' }}>
                    Applications will appear here once students submit them.
                  </p>
                </div>
              )
            )}
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
                  <CloseIcon size={20} />
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
                  <CloseIcon size={20} />
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
                                {option} {i === q.correctAnswer && <CheckIcon size={16} style={{ color: '#10b981', marginLeft: '0.5rem' }} />}
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
