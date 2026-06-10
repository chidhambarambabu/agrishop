import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/admin/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    placed: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-green-600 text-xl animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-6">
        <h1 className="text-2xl font-bold">🛡️ Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">AgriShop Control Panel</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: '👥', color: 'bg-blue-50 text-blue-700' },
            { label: 'Farmers', value: stats?.totalFarmers, icon: '🚜', color: 'bg-green-50 text-green-700' },
            { label: 'Buyers', value: stats?.totalBuyers, icon: '🛒', color: 'bg-purple-50 text-purple-700' },
            { label: 'Total Revenue', value: `₹${stats?.totalRevenue}`, icon: '💰', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Products', value: stats?.totalProducts, icon: '📦', color: 'bg-orange-50 text-orange-700' },
            { label: 'Orders', value: stats?.totalOrders, icon: '🧾', color: 'bg-red-50 text-red-700' },
            { label: 'Reviews', value: stats?.totalReviews, icon: '⭐', color: 'bg-pink-50 text-pink-700' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-2xl p-4 shadow-sm`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium opacity-75">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['overview', 'users', 'products', 'orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}>
              {tab === 'overview' ? '📊 Overview' :
               tab === 'users' ? '👥 Users' :
               tab === 'products' ? '📦 Products' : '🧾 Orders'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {stats?.recentOrders?.map((order) => (
                <div key={order._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{order.product?.name}</p>
                    <p className="text-sm text-gray-500">
                      Buyer: {order.buyer?.name} • Farmer: {order.farmer?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{order.totalPrice}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              All Users ({users.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="text-left p-3 rounded-l-lg">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Place</th>
                    <th className="text-left p-3">Joined</th>
                    <th className="text-left p-3 rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium">{user.name}</td>
                      <td className="p-3 text-gray-500">{user.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                          user.role === 'farmer'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">{user.place}</td>
                      <td className="p-3 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-3">
                        {!user.isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              All Products ({products.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="text-left p-3 rounded-l-lg">Product</th>
                    <th className="text-left p-3">Farmer</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Stock</th>
                    <th className="text-left p-3 rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium">{product.name}</td>
                      <td className="p-3 text-gray-500">{product.farmer?.name}</td>
                      <td className="p-3 capitalize text-gray-500">{product.category}</td>
                      <td className="p-3 text-green-600 font-semibold">
                        ₹{product.price}/{product.unit}
                      </td>
                      <td className="p-3 text-gray-500">{product.quantity}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              All Orders ({orders.length})
            </h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{order.product?.name}</p>
                    <p className="text-sm text-gray-500">
                      Buyer: {order.buyer?.name} • Farmer: {order.farmer?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{order.totalPrice}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${statusColors[order.status]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;