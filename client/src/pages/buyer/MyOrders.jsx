import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const statusColors = {
  placed: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

const statusIcons = {
  placed: '📦',
  confirmed: '✅',
  shipped: '🚚',
  out_for_delivery: '🛵',
  delivered: '🎉',
  cancelled: '❌'
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-green-600 text-xl font-semibold animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <Link to="/buyer/dashboard"
            className="text-green-600 hover:underline font-medium text-sm">
            ← Market
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-2">
          {['all', 'placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition ${
                filter === s
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}>
              {s}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-md">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-lg font-medium mb-2">No orders yet!</p>
            <p className="text-sm mb-4">Browse the market and place your first order.</p>
            <Link to="/buyer/dashboard"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md p-4 md:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base md:text-lg">
                      {statusIcons[order.status]} {order.product?.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Qty: {order.quantity} {order.product?.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg md:text-xl font-bold text-green-600">
                      ₹{order.totalPrice}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${statusColors[order.status]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 border-t pt-3">
                  <div>
                    <p className="font-medium text-gray-700">Farmer</p>
                    <p>{order.farmer?.name}</p>
                    <p className="text-xs">{order.farmer?.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Delivery Address</p>
                    <p className="text-xs">{order.shippingAddress}</p>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })} • Payment: <span className="uppercase font-medium">{order.paymentMethod}</span>
                </div>

                {order.statusHistory?.length > 0 && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      ORDER TIMELINE
                    </p>
                    <div className="space-y-1">
                      {order.statusHistory.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="w-2 h-2 bg-green-400 rounded-full shrink-0"></span>
                          <span className="capitalize font-medium">
                            {h.status.replace('_', ' ')}
                          </span>
                          <span>•</span>
                          <span>{new Date(h.updatedAt).toLocaleDateString('en-IN')}</span>
                          {h.note && <span>• {h.note}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;