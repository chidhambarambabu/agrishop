import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ModeSwitcher = () => {
  const { user, updateUser, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEnable, setShowEnable] = useState(false);

  if (!user || user.role !== 'farmer') return null;

  const handleSwitch = async (mode) => {
    setLoading(true);
    try {
      const { data } = await API.put('/users/switch-mode', { mode });
      updateUser(data.user);
      if (mode === 'buyer') {
        navigate('/buyer/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableBuyMode = async () => {
    setLoading(true);
    try {
      const { data } = await API.put('/users/enable-buy-mode');
      updateUser(data.user);
      navigate('/buyer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowEnable(false);
    }
  };

  return (
    <div className="relative">
      {user.activeMode === 'farmer' ? (
        <div className="flex items-center gap-2">
          {user.canBuy ? (
            <button
              onClick={() => handleSwitch('buyer')}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 transition disabled:opacity-50"
            >
              🛒 Switch to Buyer
            </button>
          ) : (
            <button
              onClick={() => setShowEnable(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 transition"
            >
              🛒 Enable Buy Mode
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => handleSwitch('farmer')}
          disabled={loading}
          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600 transition disabled:opacity-50"
        >
          🚜 Switch to Farmer
        </button>
      )}

      {/* Enable Buy Mode Modal */}
      {showEnable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Enable Buy Mode</h3>
            <p className="text-gray-500 text-sm mb-4">
              As a farmer, you can also buy products from other farmers!
              Enable buy mode to access the marketplace as a buyer.
            </p>
            <div className="bg-green-50 rounded-xl p-3 mb-4 text-sm text-green-700">
              ✅ Browse all products<br />
              ✅ Place orders from other farmers<br />
              ✅ Track your purchases<br />
              ✅ Switch back to farmer mode anytime
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEnable(false)}
                className="flex-1 border-2 border-gray-300 text-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEnableBuyMode}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Enabling...' : 'Enable & Shop!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeSwitcher;