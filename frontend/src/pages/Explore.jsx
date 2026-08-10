import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getExploreStores } from '../services/storeService';
import { submitStoreRating } from '../services/ratingService';

export default function Explore() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await getExploreStores({
        name: searchName,
        address: searchAddress
      });
      setStores(data.data.stores);
    } catch (error) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(); 
  };

  const handleRatingChange = async (storeId, newValue) => {
    try {
      await submitStoreRating(storeId, Number(newValue));
      toast.success('Rating saved successfully!');
      fetchStores(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Explore Stores</h1>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by store name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by address..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Stores Grid */}
      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading stores...</p>
      ) : stores.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No stores found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => {
            const myRating = store.ratings && store.ratings.length > 0 
              ? store.ratings[0].value 
              : '';

            return (
              <div key={store.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{store.address}</p>
                  
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="font-semibold text-gray-700">
                      {store.overallRating > 0 ? store.overallRating : 'No ratings yet'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                  <select
                    value={myRating}
                    onChange={(e) => handleRatingChange(store.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="" disabled>Rate...</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}