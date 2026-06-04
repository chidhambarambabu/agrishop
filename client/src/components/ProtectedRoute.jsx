import { Link } from 'react-router-dom';

const categoryIcons = {
  vegetables: '🥦',
  fruits: '🍎',
  grains: '🌾',
  dairy: '🥛',
  spices: '🌶️',
  other: '📦'
};

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/buyer/product/${product._id}`}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      <div className="bg-green-50 h-40 flex items-center justify-center text-6xl group-hover:bg-green-100 transition">
        {categoryIcons[product.category] || '📦'}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">{product.name}</h3>
          <span className="capitalize bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold ml-2 shrink-0">
            {product.category}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-bold text-xl">
            ₹{product.price}
            <span className="text-sm font-normal text-gray-400">/{product.unit}</span>
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            product.quantity > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          }`}>
            {product.quantity > 0 ? `${product.quantity} ${product.unit} left` : 'Out of Stock'}
          </span>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <div>📍 {product.locality}</div>
          <div>🚜 {product.farmer?.name} • {product.farmer?.place}</div>
          {product.shippingCharges > 0 && (
            <div>🚚 Shipping: ₹{product.shippingCharges}</div>
          )}
        </div>

        <div className="mt-3 bg-green-600 text-white text-center py-2 rounded-lg text-sm font-semibold group-hover:bg-green-700 transition">
          View & Order
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;