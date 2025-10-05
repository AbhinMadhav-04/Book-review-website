import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBook, setReviewBook] = useState(null);

  // Fetch all books from all users
  const fetchBooks = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await API.get(`/books?page=${pageNumber}&limit=6`);
      setBooks(res.data.data || res.data.books || []);
      setTotalPages(res.data.totalPages || res.data.data?.totalPages || 1);
      setPage(pageNumber);
    } catch (err) {
      console.log("[BookList] Failed to fetch books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
    // eslint-disable-next-line
  }, []);

  const handleViewDetails = (id) => navigate(`/books/${id}`);
  const handleReview = (book) => {
    setReviewBook(book);
    setShowReviewModal(true);
  };
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewBook(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) fetchBooks(newPage);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">
      <main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">All Books</h1>
        {loading ? (
          <p className="text-center text-lg">Loading books...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((item) => (
              <BookCard
                key={item._id}
                book={item}
                onView={() => handleViewDetails(item._id)}
                onReview={handleReview}
                hideActions={true}
              />
            ))}
          </div>
        )}
        {/* Pagination */}
        <nav className="flex items-center justify-center pt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
            disabled={page === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm mx-1 ${
                page === i + 1
                  ? "bg-primary text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
            disabled={page === totalPages}
          >
            Next
          </button>
        </nav>
      {/* Review Modal */}
      {showReviewModal && reviewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button onClick={closeReviewModal} className="absolute top-2 right-2 text-xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Review: {reviewBook.title}</h2>
            {/* Review form will go here */}
            <ReviewForm bookId={reviewBook._id} onClose={closeReviewModal} />
          </div>
        </div>
      )}
      </main>
    </div>
  );
}

// ReviewForm for submitting a review
function ReviewForm({ bookId, onClose }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (rating < 1 || rating > 5) {
      setError("Please select a star rating.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/reviews", { bookId, rating, reviewText });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Star Rating</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              type="button"
              key={i}
              className={`w-8 h-8 text-2xl ${i < rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}
              onClick={() => setRating(i + 1)}
              aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Your Review</label>
        <textarea
          className="w-full rounded border border-slate-300 dark:border-slate-700 p-2 min-h-[80px] bg-slate-50 dark:bg-slate-800"
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder="Write your review here..."
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Review submitted!</div>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}

export default BookList;
