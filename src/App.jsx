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
        height: '100vh' 
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

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} requiredRole="admin" userRole={userRole}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={
              !user ? 
                <Navigate to="/login" replace /> : 
                !userRole ? 
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div className="spinner"></div>
                  </div> :
                  <Navigate to={userRole === 'admin' ? '/admin' : '/student'} replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
