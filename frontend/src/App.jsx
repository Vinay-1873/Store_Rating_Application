import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout'; // <-- Import the layout

// Import our pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import Explore from './pages/Explore';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Catch-all redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* ALL Protected Routes wrapped in the DashboardLayout */}
            <Route element={<DashboardLayout />}>
              
              {/* System Administrator Route */}
              <Route element={<ProtectedRoute allowedRoles={['System Administrator']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Store Owner Route */}
              <Route element={<ProtectedRoute allowedRoles={['Store Owner']} />}>
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              </Route>

              {/* Normal User Route */}
              <Route element={<ProtectedRoute allowedRoles={['Normal User']} />}>
                <Route path="/explore" element={<Explore />} />
              </Route>

            </Route>
          </Routes>
          
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;