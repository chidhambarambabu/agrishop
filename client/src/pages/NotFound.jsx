import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🌾</div>
        <h1 className="text-6xl font-bold text-green-700 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Page not found</p>
        <p className="text-gray-500 mb-8">Looks like this crop didn't grow here.</p>
        <Link
          to="/"
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;