import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', category: 'vegetables',
    price: '', quantity: '', unit: 'kg',
    locality: '', shippingCharges: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (image) formData.append('image', image);

      await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-1">Add New Product</h2>
          <p className="text-gray-500 mb-6">List your farm produce for buyers</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition cursor-pointer"
                onClick={() => document.getElementById('imageInput').click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview"
                    className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <div>
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-gray-500 text-sm">Click to upload product image</p>
                    <p className="text-gray-400 text-xs">JPG, PNG, WEBP up to 5MB</p>
                  </div>
                )}
              </div>
              <input
                id="imageInput" type="file" accept="image/*"
                onChange={handleImageChange} className="hidden"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Fresh Tomatoes"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                placeholder="Describe your product..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                {['vegetables', 'fruits', 'grains', 'dairy', 'spices', 'other'].map(cat => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            </div>

            {/* Price & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number" name="price" value={form.price} onChange={handleChange}
                  placeholder="e.g. 40"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['kg', 'gram', 'litre', 'piece', 'dozen'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity & Shipping */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number" name="quantity" value={form.quantity} onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping (₹)</label>
                <input
                  type="number" name="shippingCharges" value={form.shippingCharges} onChange={handleChange}
                  placeholder="e.g. 50"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Locality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
              <input
                type="text" name="locality" value={form.locality} onChange={handleChange}
                placeholder="e.g. Coimbatore"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => navigate('/farmer/dashboard')}
                className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;