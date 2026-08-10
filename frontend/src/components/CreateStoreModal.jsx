import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAllUsers, createStore } from '../services/adminService';

export default function CreateStoreModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOwners, setFetchingOwners] = useState(false);

  // Fetch Store Owners when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchOwners();
    }
  }, [isOpen]);

  const fetchOwners = async () => {
    setFetchingOwners(true);
    try {
      // We use our existing API function and filter by role!
      const { data } = await getAllUsers({ role: 'Store Owner' });
      setOwners(data.users);
    } catch (error) {
      toast.error('Failed to load store owners.');
    } finally {
      setFetchingOwners(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createStore(formData);
      toast.success('Store created successfully!');
      
      // Reset form, tell parent to refresh data, and close modal
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      onSuccess(); 
      onClose();
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || 'Failed to create store.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Add New Store</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input 
              type="text" name="name" required minLength={2} maxLength={60}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.name} onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Email</label>
            <input 
              type="email" name="email" required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.email} onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea 
              name="address" required maxLength={400} rows="2"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.address} onChange={handleChange}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign Store Owner</label>
            <select
              name="ownerId" required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.ownerId} onChange={handleChange}
              disabled={fetchingOwners || owners.length === 0}
            >
              <option value="" disabled>
                {fetchingOwners ? 'Loading owners...' : owners.length === 0 ? 'No Store Owners found!' : 'Select an owner...'}
              </option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
            {owners.length === 0 && !fetchingOwners && (
              <p className="text-xs text-red-500 mt-1">You must register a user with the "Store Owner" role first.</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" disabled={loading || owners.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}