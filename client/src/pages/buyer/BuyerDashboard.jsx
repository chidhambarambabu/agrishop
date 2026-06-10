import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;
      if (sortBy) params.sortBy = sortBy;
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

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setTimeout(() => fetchProducts(), 100);
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

  const sortOptions = [
    { value: 'newest', label: '🕒 Newest First' },
    { value: 'oldest', label: '🕒 Oldest First' },
    { value: 'price_low', label: '💰 Price: Low to High' },
    { value: 'price_high', label: '💰 Price: High to Low' },
    { value: 'rating', label: '⭐ Top Rated' },
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
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for vegetables, fruits, grains..."
            className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
          />
          <button type="submit"
            className="bg-white text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-green-100 transition">
            Search
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters Row */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat.value} onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    category === cat.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <input
                type="number" placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-gray-400">—</span>
              <input
                type="number" placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button onClick={fetchProducts}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                Apply
              </button>
            </div>

            {/* Clear Filters */}
            <button onClick={handleClearFilters}
              className="text-red-500 hover:text-red-700 text-sm font-semibold ml-auto">
              ✕ Clear
            </button>

            {/* My Orders */}
            <Link to="/buyer/orders"
              className="px-4 py-1.5 rounded-full text-sm font-semibold bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition">
              📋 My Orders
            </Link>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-4">
            {products.length} product{products.length !== 1 ? 's' : ''} found
            {category && ` in ${category}`}
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-40"></div>
                <div className="p-4 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm mb-4">Try different filters or search terms</p>
            <button onClick={handleClearFilters}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/buyer/product/${product._id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="bg-green-50 h-40 flex items-center justify-center text-6xl group-hover:bg-green-100 transition overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover" />
                  ) : (
                    getCategoryIcon(product.category)
                  )}
                </div>
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
                      <span className="text-sm font-normal text-gray-400">/{product.unit}</span>
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