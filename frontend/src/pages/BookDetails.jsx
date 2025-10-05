

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editError, setEditError] = useState("");

  const fetchBook = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get(`/books/${bookId}`);
      // Backend returns { success, data: { book, reviews, avgRating } }
      const data = res.data?.data || {};
      setBook(data.book || data);
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);
    } catch (err) {
      console.log("[BookDetails] Failed to load book details:", err);
      setError("Failed to load book details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line
  }, [bookId]);

  // Edit review handlers
  const startEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditReviewText(review.reviewText || "");
    setEditRating(review.rating || 0);
    setEditError("");
  };

  const cancelEditReview = () => {
    setEditingReviewId(null);
    setEditReviewText("");
    setEditRating(0);
    setEditError("");
  };

  const handleEditReview = async (reviewId) => {
    if (editRating < 1 || editRating > 5) {
      setEditError("Please select a star rating.");
      return;
    }
    try {
      await API.put(`/reviews/${reviewId}`, { rating: editRating, reviewText: editReviewText });
      setEditingReviewId(null);
      setEditReviewText("");
      setEditRating(0);
      setEditError("");
      fetchBook();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-slate-600 dark:text-slate-400">Loading book details...</div>;
  }
  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-lg text-red-500 px-4">
        <p>{error || "Book not found."}</p>
        <button
          onClick={() => navigate("/books")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Back to Book List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-display">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-10 py-3">
        <h2
          className="text-2xl font-bold cursor-pointer text-slate-900 dark:text-white"
          onClick={() => navigate("/books")}
        >
          BookVerse
        </h2>
      </header>
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8 bg-white dark:bg-slate-900/50 p-6 rounded-lg shadow-sm">
          {/* Book image */}
          <div className="w-full h-60 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded mb-4 overflow-hidden">
            {book.cover || book.image ? (
              <img
                src={book.cover || book.image}
                alt={book.title}
                className="object-contain h-full max-w-full"
              />
            ) : (
              <span className="text-slate-400 dark:text-slate-600">Book cover image here</span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{book.title || <span className="italic text-slate-400">No title</span>}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">{book.author ? `by ${book.author}` : <span className="italic text-slate-400">No author</span>}</p>
            {book.genre && (
              <p className="text-sm text-primary">Genre: {book.genre}</p>
            )}
            {book.year && (
              <p className="text-sm text-primary">Year: {book.year}</p>
            )}
            {book.addedBy && (
              <p className="text-xs text-slate-400 dark:text-slate-500">Added by: {book.addedBy.fullName || book.addedBy.name || book.addedBy.email}</p>
            )}
            <p className="mt-4 text-slate-700 dark:text-slate-300">
              {book.description || <span className="italic text-slate-400">No description provided.</span>}
            </p>
            {/* Average Rating */}
            <div className="flex items-center gap-2 mt-4">
              <span className="font-semibold">Average Rating:</span>
              <span className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                ))}
              </span>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">({avgRating.toFixed(1)})</span>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Reviews</h3>
          {reviews.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isOwnReview = user && review.userId && (review.userId._id === user._id || review.userId === user._id);
                return (
                  <div key={review._id} className="border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                      ))}
                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{review.userId?.name || 'Anonymous'}</span>
                      {isOwnReview && editingReviewId !== review._id && (
                        <>
                          <button onClick={() => startEditReview(review)} className="ml-2 text-xs text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleDeleteReview(review._id)} className="ml-2 text-xs text-red-600 hover:underline">Delete</button>
                        </>
                      )}
                    </div>
                    {editingReviewId === review._id ? (
                      <form onSubmit={e => { e.preventDefault(); handleEditReview(review._id); }} className="space-y-2 mt-1">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              type="button"
                              key={i}
                              className={`w-6 h-6 text-xl ${i < editRating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}
                              onClick={() => setEditRating(i + 1)}
                              aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                            >★</button>
                          ))}
                        </div>
                        <textarea
                          className="w-full rounded border border-slate-300 dark:border-slate-700 p-2 min-h-[60px] bg-slate-50 dark:bg-slate-800 text-sm"
                          value={editReviewText}
                          onChange={e => setEditReviewText(e.target.value)}
                        />
                        {editError && <div className="text-red-500 text-xs">{editError}</div>}
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={cancelEditReview} className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs">Cancel</button>
                          <button type="submit" className="px-3 py-1 rounded bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700">Save</button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-slate-700 dark:text-slate-300 text-sm">{review.reviewText}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
