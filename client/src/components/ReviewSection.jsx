import { useState, useEffect } from 'react';
import API from '../api/axios';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${productId}`);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) {
      setError('Please select a rating');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { data } = await API.post('/reviews', {
        productId,
        rating: form.rating,
        comment: form.comment
      });
      setReviews([data.review, ...reviews]);
      setForm({ rating: 0, comment: '' });
      setSuccess('Review added successfully! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      console.error(err);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Reviews & Ratings
        {reviews.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({reviews.length} reviews)
          </span>
        )}
      </h2>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="bg-green-50 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="text-5xl font-bold text-green-600">{avgRating}</div>
          <div>
            <StarRating rating={Math.round(avgRating)} size="md" />
            <p className="text-gray-500 text-sm mt-1">
              Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Add Review Form - buyers only */}
      {user?.role === 'buyer' && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Write a Review</h3>

          {success && (
            <div className="bg-green-50 text-green-600 p-2 rounded-lg mb-3 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 p-2 rounded-lg mb-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Your Rating</label>
              <StarRating
                rating={form.rating}
                onRate={(star) => setForm({ ...form, rating: star })}
                size="lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Your Comment</label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>
            <button
              type="submit" disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-4 text-gray-500 animate-pulse">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">⭐</div>
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{review.buyer?.name}</p>
                  <p className="text-xs text-gray-400">{review.buyer?.place}</p>
                </div>
                <div className="text-right">
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
              {user?._id === review.buyer?._id && (
                <button
                  onClick={() => handleDelete(review._id)}
                  className="mt-2 text-red-400 hover:text-red-600 text-xs"
                >
                  Delete review
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;