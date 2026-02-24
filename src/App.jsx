import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { logInfo } from './logger';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CareerSelection from './pages/CareerSelection';
import LocationSelection from './pages/LocationSelection';
import CollegeList from './pages/CollegeList';
import CollegeDetails from './pages/CollegeDetails';
import StudentDetails from './pages/StudentDetails';
import AptitudeTest from './pages/AptitudeTest';
import TestCompletion from './pages/TestCompletion';
import CollegeApplication from './pages/CollegeApplication';
import ApplicationHistory from './pages/ApplicationHistory';
import CollegeComparison from './pages/CollegeComparison';
import CareerRoadmap from './pages/CareerRoadmap';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        logInfo('AUTH', 'User authenticated', { userId: currentUser.uid });
        
        // Get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
            logInfo('AUTH', 'User role fetched', { role: userDoc.data().role });
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
        
        setUser(currentUser);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f8fafc'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Navbar user={user} userRole={userRole} />
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              user && userRole ? 
                <Navigate to={userRole === 'admin' ? '/admin' : '/student'} replace /> : 
                <LandingPage />
            } 
          />
          <Route 
            path="/login" 
            element={
              user && userRole ? 
                <Navigate to={userRole === 'admin' ? '/admin' : '/student'} replace /> : 
                <Login />
            } 
          />
          <Route 
            path="/signup" 
            element={
              user && userRole ? 
                <Navigate to={userRole === 'admin' ? '/admin' : '/student'} replace /> : 
                <SignUp />
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/career-selection" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <CareerSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/career-roadmap" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <CareerRoadmap />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/location-selection" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <LocationSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/college-list" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <CollegeList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/college/:id" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <CollegeDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-details" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <StudentDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/aptitude-test" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <AptitudeTest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test-completion" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <TestCompletion />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/college-apply/:collegeId" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <CollegeApplication />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <ApplicationHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/college-compare" 
            element={
              <ProtectedRoute user={user} requiredRole="student" userRole={userRole}>
                <CollegeComparison />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} requiredRole="admin" userRole={userRole}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
