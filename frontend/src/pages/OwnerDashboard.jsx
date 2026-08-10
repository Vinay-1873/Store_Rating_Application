import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getOwnerDashboard } from '../services/ownerService';

export default function OwnerDashboard() {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await getOwnerDashboard();
      setStoreData(data.store);
    } catch (error) {
      // 404 means the admin hasn't assigned a store to this owner yet
      if (error.response?.status === 404) {
        toast.info('No store assigned to your account yet.');
      } else {
        toast.error('Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  if (!storeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to your Dashboard</h2>
        <p className="mt-2 text-gray-600">A System Administrator has not assigned a store to your account yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{storeData.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{storeData.address}</p>
          <p className="text-xs text-gray-400 mt-1">Contact: {storeData.email}</p>
        </div>
        
        <div className="bg-blue-50 px-6 py-4 rounded-lg border border-blue-100 text-center min-w-[150px]">
          <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider">Average Rating</h3>
          <div className="text-4xl font-bold text-blue-600 mt-2 flex items-center justify-center gap-1">
            {storeData.averageRating > 0 ? storeData.averageRating : '-'}
            <span className="text-yellow-500 text-2xl">★</span>
          </div>
        </div>
      </div>

      {/* Ratings List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Ratings</h2>
          <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-semibold">
            {storeData.ratings?.length || 0} Total Reviews
          </span>
        </div>

        {storeData.ratings && storeData.ratings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-sm font-medium text-gray-500 border-b">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {storeData.ratings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">{rating.user?.name}</td>
                    <td className="p-4 text-sm text-gray-500">{rating.user?.email}</td>
                    <td className="p-4">
                      <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < rating.value ? 'opacity-100' : 'opacity-20'}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No one has rated your store yet.
          </div>
        )}
      </div>
    </div>
  );
}