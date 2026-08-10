import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import UpdatePasswordModal from '../components/UpdatePasswordModal';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getNavLinks = () => {
    const links = [{ to: '/', label: 'Home' }];

    if (user?.role === 'System Administrator') {
      links.push({ to: '/admin/dashboard', label: 'Dashboard' });
    } else if (user?.role === 'Store Owner') {
      links.push({ to: '/owner/dashboard', label: 'Dashboard' });
    } else if (user?.role === 'Normal User') {
      links.push({ to: '/explore', label: 'Explore' });
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Brand */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold text-blue-600">
                StoreRating Pro
              </Link>

              <div className="hidden md:flex items-center gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `rounded-full px-3 py-2 text-sm font-medium transition ${
                        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right side - User Info & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                <span className="text-xs text-gray-500">{user?.role}</span>
              </div>
              
              {/* ---> THE MISSING SETTINGS BUTTON <--- */}
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:ring-4 focus:ring-gray-100"
              >
                Settings
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:ring-4 focus:ring-red-300"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* The Modal Component */}
      <UpdatePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}