import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          API.get('/products/my-products'),
          API.get('/orders/farmer-orders')
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'placed').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-green-600 text-xl font-semibold animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}! 🌾</h1>
        <p className="text-green-200 mt-1">Manage your farm products and orders</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products.length, icon: '📦', color: 'bg-blue-50 text-blue-700' },
            { label: 'Total Orders', value: orders.length, icon: '🛒', color: 'bg-green-50 text-green-700' },
            { label: 'Pending Orders', value: pendingOrders, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: '💰', color: 'bg-purple-50 text-purple-700' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-2xl p-4 shadow-sm`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium opacity-75">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/farmer/add-product"
            className="bg-green-600 text-white rounded-2xl p-6 text-center hover:bg-green-700 transition shadow-md">
            <div className="text-4xl mb-2">➕</div>
            <div className="font-bold text-lg">Add New Product</div>
            <div className="text-green-200 text-sm">List your farm produce</div>
          </Link>
          <Link to="/farmer/orders"
            className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition shadow-md border border-gray-100">
            <div className="text-4xl mb-2">📋</div>
            <div className="font-bold text-lg text-gray-800">Manage Orders</div>
            <div className="text-gray-500 text-sm">{pendingOrders} pending orders</div>
          </Link>
          <div className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-100">
            <div className="text-4xl mb-2">💰</div>
            <div className="font-bold text-lg text-gray-800">Revenue</div>
            <div className="text-green-600 font-bold text-xl">₹{totalRevenue}</div>
          </div>
        </div>

        {/* My Products */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">My Products</h2>
            <Link to="/farmer/add-product"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
              + Add Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-5xl mb-3">📦</div>
              <p>No products yet. Add your first product!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="text-left p-3 rounded-l-lg">Product</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Stock</th>
                    <th className="text-left p-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{p.name}</td>
                      <td className="p-3 capitalize text-gray-600">{p.category}</td>
                      <td className="p-3 text-green-600 font-semibold">₹{p.price}/{p.unit}</td>
                      <td className="p-3 text-gray-600">{p.quantity} {p.unit}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.isAvailable ? 'Available' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link to="/farmer/orders" className="text-green-600 hover:underline text-sm font-semibold">
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-5xl mb-3">🛒</div>
              <p>No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{order.product?.name}</p>
                    <p className="text-sm text-gray-500">Buyer: {order.buyer?.name} • Qty: {order.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{order.totalPrice}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      order.status === 'placed' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;