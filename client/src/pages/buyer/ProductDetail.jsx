import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    quantity: 1,
    shippingAddress: user?.place || '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    setOrdering(true);
    setError('');
    try {
      await API.post('/orders', {
        productId: id,
        quantity: Number(form.quantity),
        shippingAddress: form.shippingAddress,
        paymentMethod: form.paymentMethod
      });
      setSuccess('Order placed successfully! 🎉');
      setTimeout(() => navigate('/buyer/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-green-600 text-xl font-semibold animate-pulse">Loading...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Product not found.
    </div>
  );

  const totalPrice = (product.price * form.quantity) + product.shippingCharges;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-green-600 hover:underline mb-6 flex items-center gap-1 font-medium"
        >
          ← Back to Market
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Info */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-green-50 h-56 flex items-center justify-center text-8xl">
              {product.category === 'vegetables' ? '🥦' :
               product.category === 'fruits' ? '🍎' :
               product.category === 'grains' ? '🌾' :
               product.category === 'dairy' ? '🥛' :
               product.category === 'spices' ? '🌶️' : '📦'}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
                <span className="capitalize bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                  {product.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Price</span>
                  <span className="font-bold text-green-600 text-lg">₹{product.price}/{product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Stock</span>
                  <span className="font-medium">{product.quantity} {product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="font-medium">₹{product.shippingCharges}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium">📍 {product.locality}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-700">🚜 Farmer Details</p>
                <p className="text-sm text-gray-600 mt-1">{product.farmer?.name}</p>
                <p className="text-sm text-gray-500">{product.farmer?.place} • {product.farmer?.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Place Order</h2>

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity ({product.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address
                </label>
                <textarea
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  placeholder="Enter your full delivery address"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'cod', label: '💵 Cash on Delivery' },
                    { value: 'online', label: '💳 Online Payment' }
                  ].map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: p.value })}
                      className={`py-2 px-3 rounded-lg text-sm font-semibold border-2 transition ${
                        form.paymentMethod === p.value
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({form.quantity} {product.unit})</span>
                  <span>₹{product.price * form.quantity}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{product.shippingCharges}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-base border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600">₹{totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={ordering}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 text-lg"
              >
                {ordering ? 'Placing Order...' : `Place Order • ₹${totalPrice}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;