import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        🌾 AgriShop
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-green-200 transition">Login</Link>
            <Link
              to="/register"
              className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to={user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'}
              className="hover:text-green-200 transition text-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="hover:text-green-200 transition text-sm"
            >
              👤 {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;