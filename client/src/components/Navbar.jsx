import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          🌾 AgriShop
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="hover:text-green-200 transition">Login</Link>
              <Link to="/register"
                className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition">
                Register
              </Link>
            </>
          ) : (
            <>
              {user.isAdmin && (
                <Link to="/admin/dashboard"
                  className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg text-sm font-bold hover:bg-yellow-300 transition">
                  🛡️ Admin
                </Link>
              )}
              <Link
                to={user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'}
                className="hover:text-green-200 transition text-sm"
              >
                Dashboard
              </Link>
              <NotificationBell />
              <Link to="/profile" className="hover:text-green-200 transition text-sm">
                👤 {user.name}
              </Link>
              <button onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <NotificationBell />}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-green-600 transition"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-green-800 px-4 py-3 space-y-2 border-t border-green-600">
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-green-200 transition">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="block bg-white text-green-700 px-4 py-2 rounded-lg font-semibold text-center">
                Register
              </Link>
            </>
          ) : (
            <>
              {user.isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}
                  className="block bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-center">
                  🛡️ Admin Dashboard
                </Link>
              )}
              <Link
                to={user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'}
                onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-green-200 transition"
              >
                📊 Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}
                className="block py-2 hover:text-green-200 transition">
                👤 Profile ({user.name})
              </Link>
              <button onClick={handleLogout}
                className="w-full bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition text-left">
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;