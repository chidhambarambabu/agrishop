import { useEffect, useState } from 'react';
import API from '../../api/axios';

const statusColors = {
  placed: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

const nextStatuses = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: []
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/farmer-orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map(o =>
        o._id === orderId ? { ...o, status } : o
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-2">
          {['all', 'placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition ${
                filter === s
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-md">
            <div className="text-5xl mb-3">📋</div>
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md p-4 md:p-6">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base md:text-lg">
                      {order.product?.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Buyer: <span className="font-medium text-gray-700">
                        {order.buyer?.name}
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs">
                      📞 {order.buyer?.phone}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Qty: {order.quantity} • 📍 {order.shippingAddress}
                    </p>
                    <p className="text-gray-500 text-xs uppercase font-medium mt-1">
                      💳 {order.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">₹{order.totalPrice}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${statusColors[order.status]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {nextStatuses[order.status]?.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap items-center border-t pt-3">
                    <span className="text-xs text-gray-500">Update:</span>
                    {nextStatuses[order.status].map(s => (
                      <button key={s}
                        onClick={() => updateStatus(order._id, s)}
                        disabled={updating === order._id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition disabled:opacity-50 ${
                          s === 'cancelled'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}>
                        {updating === order._id ? '...' : s.replace('_', ' ')}
                      </button>
                    ))}
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

export default ManageOrders;