import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      const { data } = await API.get('/products', { params });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = [
    { value: '', label: '🌿 All' },
    { value: 'vegetables', label: '🥦 Vegetables' },
    { value: 'fruits', label: '🍎 Fruits' },
    { value: 'grains', label: '🌾 Grains' },
    { value: 'dairy', label: '🥛 Dairy' },
    { value: 'spices', label: '🌶️ Spices' },
    { value: 'other', label: '📦 Other' },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      vegetables: '🥦', fruits: '🍎', grains: '🌾',
      dairy: '🥛', spices: '🌶️', other: '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">🛒 Fresh Produce Market</h1>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for vegetables, fruits..."
            className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
          />
          <button type="submit"
            className="bg-white text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-green-100 transition">
            Search
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                category === cat.value
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
              }`}>
              {cat.label}
            </button>
          ))}
          <Link to="/buyer/orders"
            className="ml-auto px-4 py-2 rounded-full text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:border-green-400 transition">
            📋 My Orders
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16 text-green-600 font-semibold animate-pulse">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/buyer/product/${product._id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="bg-green-50 h-40 flex items-center justify-center text-6xl group-hover:bg-green-100 transition overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover" />
                  ) : (
                    getCategoryIcon(product.category)
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">
                      {product.name}
                    </h3>
                    <span className="capitalize bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold ml-2 shrink-0">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Star Rating */}
                  {product.totalReviews > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <span className="text-yellow-400">★</span>
                      <span>{product.averageRating}</span>
                      <span>({product.totalReviews})</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600 font-bold text-xl">
                      ₹{product.price}
                      <span className="text-sm font-normal text-gray-400">
                        /{product.unit}
                      </span>
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      product.quantity > 0
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {product.quantity > 0
                        ? `${product.quantity} ${product.unit} left`
                        : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <div>📍 {product.locality}</div>
                    <div>🚜 {product.farmer?.name} • {product.farmer?.place}</div>
                    {product.shippingCharges > 0 && (
                      <div>🚚 Shipping: ₹{product.shippingCharges}</div>
                    )}
                  </div>

                  <div className="mt-3 bg-green-600 text-white text-center py-2 rounded-lg text-sm font-semibold group-hover:bg-green-700 transition">
                    View & Order
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;