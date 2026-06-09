const StarRating = ({ rating, onRate, size = 'md' }) => {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate && onRate(star)}
          className={`${sizes[size]} transition ${
            onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          }`}
        >
          <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;