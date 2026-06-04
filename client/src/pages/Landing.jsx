import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero */}
      <div className="bg-green-700 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">🌾 AgriShop</h1>
        <p className="text-xl text-green-100 mb-2">Fresh from Farm to Your Door</p>
        <p className="text-green-200 mb-8 max-w-xl mx-auto">
          Connecting farmers directly with buyers — no middlemen, fair prices, fresh produce.
        </p>
        {!user ? (
          <div className="flex gap-4 justify-center">
            <Link to="/register"
              className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-100 transition">
              Get Started
            </Link>
            <Link to="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-600 transition">
              Login
            </Link>
          </div>
        ) : (
          <Link
            to={user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'}
            className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-100 transition"
          >
            Go to Dashboard
          </Link>
        )}
      </div>

      {/* Features */}
      <div className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Why AgriShop?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🚜', title: 'For Farmers', desc: 'Sell directly to buyers and get fair prices for your hard work.' },
            { icon: '🛒', title: 'For Buyers', desc: 'Buy fresh produce directly from farmers at lower prices.' },
            { icon: '✂️', title: 'No Middlemen', desc: 'Cut out intermediaries — more profit for farmers, less cost for buyers.' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-green-700 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {[
            { icon: '🥦', name: 'Vegetables' },
            { icon: '🍎', name: 'Fruits' },
            { icon: '🌾', name: 'Grains' },
            { icon: '🥛', name: 'Dairy' },
            { icon: '🌶️', name: 'Spices' },
            { icon: '📦', name: 'Other' },
          ].map((cat, i) => (
            <div key={i} className="bg-green-50 rounded-xl p-4 text-center cursor-pointer hover:bg-green-100 transition">
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="text-green-700 font-semibold text-sm">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-green-700 py-16 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-10">AgriShop by Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { number: '500+', label: 'Farmers Registered' },
            { number: '10,000+', label: 'Products Listed' },
            { number: '₹50L+', label: 'Farmer Earnings' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-green-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6 text-center bg-green-50">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Join thousands of farmers and buyers already using AgriShop.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register"
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition">
            🚜 Join as Farmer
          </Link>
          <Link to="/register"
            className="bg-white text-green-700 border-2 border-green-600 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition">
            🛒 Join as Buyer
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 px-6 text-center">
        <p className="text-2xl mb-2">🌾 AgriShop</p>
        <p className="text-sm">Connecting farmers directly with buyers across India.</p>
        <p className="text-xs mt-4">© 2024 AgriShop. Built with ❤️ for Indian farmers.</p>
      </footer>
    </div>
  );
};

export default Landing;