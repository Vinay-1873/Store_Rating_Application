import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAdminStats, getAllUsers, getAllStores } from '../services/adminService';
import CreateStoreModal from '../components/CreateStoreModal';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  
  // Filtering and Sorting State for Users
  const [userFilters, setUserFilters] = useState({ name: '', email: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'createdAt', order: 'DESC' });

  useEffect(() => {
    fetchStats();
    fetchUsers();
  
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userSort]);

  const fetchStats = async () => {
    try {
      const { data } = await getAdminStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers({ ...userFilters, ...userSort });
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleUserSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleSort = (field) => {
    setUserSort(prev => ({
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  return (
    <div className="space-y-8">
      {/* Updated Header with Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Administrator Dashboard</h1>
        <button 
          onClick={() => setIsStoreModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Add New Store
        </button>
      </div>
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Stores</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalStores}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Ratings</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalRatings}</p>
        </div>
      </div>

      {/* 2. Users Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Management</h2>
          
          {/* Filters */}
          <form onSubmit={handleUserSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Filter by Name..."
              className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              value={userFilters.name}
              onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Filter by Email..."
              className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              value={userFilters.email}
              onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
            />
            <select
              className="px-4 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              value={userFilters.role}
              onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
            >
              <option value="">All Roles</option>
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              <option value="System Administrator">System Administrator</option>
            </select>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              Apply Filters
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-sm font-medium text-gray-500 border-b">
                <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => toggleSort('name')}>
                  Name {userSort.sortBy === 'name' && (userSort.order === 'ASC' ? '↑' : '↓')}
                </th>
                <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => toggleSort('email')}>
                  Email {userSort.sortBy === 'email' && (userSort.order === 'ASC' ? '↑' : '↓')}
                </th>
                <th className="p-4">Address</th>
                <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => toggleSort('role')}>
                  Role {userSort.sortBy === 'role' && (userSort.order === 'ASC' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-sm text-gray-500">{user.email}</td>
                  <td className="p-4 text-sm text-gray-500 truncate max-w-xs">{user.address}</td>
                  <td className="p-4 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'System Administrator' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Store Owner' ? 'bg-green-100 text-green-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateStoreModal 
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onSuccess={fetchStats} // Refreshes the total stores count after creating one
      />
    </div>
  );
}