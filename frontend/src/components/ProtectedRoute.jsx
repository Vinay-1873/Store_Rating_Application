import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'System Administrator') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'Store Owner') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/explore" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;