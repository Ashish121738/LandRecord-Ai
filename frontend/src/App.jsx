import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// 🌐 Public & Auth Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

// 🗺️ Shared Pages
import MapPage from './pages/Map';

// 🏢 Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRecords from './pages/admin/Records';

// 🛡️ Verifier Pages
import VerifierDashboard from './pages/verifier/Dashboard';
import VerificationQueue from './pages/verifier/Verification';
import RecordDetails from './pages/verifier/RecordDetails';

// 👨‍👩‍👦 Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import Upload from './pages/citizen/Upload';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');
  
  if (!token) return <Navigate to="/login" replace />;
  // Agar galat role wala kisi aur ke page pe jane ki koshish kare:
  if (allowedRole && userRole !== allowedRole) return <Navigate to={`/${userRole}/dashboard`} replace />;
  
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Catch-all for old broken links */}
        <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="records" element={<AdminRecords />} />
          <Route path="gis" element={<MapPage />} />
        </Route>

        {/* VERIFIER ROUTES */}
        <Route path="/verifier" element={<ProtectedRoute allowedRole="verifier"><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<VerifierDashboard />} />
          <Route path="queue" element={<VerificationQueue />} />
          <Route path="record/:id" element={<RecordDetails />} />
          <Route path="gis" element={<MapPage />} />
        </Route>

        {/* CITIZEN ROUTES */}
        <Route path="/citizen" element={<ProtectedRoute allowedRole="citizen"><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="upload" element={<Upload />} />
        </Route>
        
        {/* 404 Redirect - Agar koi ulta-seedha URL daale toh Landing Page par bhej do */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}