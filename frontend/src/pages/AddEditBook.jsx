import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { uploadImageToCloudinary } from "../api/cloudinary";
import { useNavigate, useParams } from "react-router-dom";

const BookForm = () => {
  const { bookId } = useParams(); // if editing, bookId will be in URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  // Remove file upload, only allow image URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch existing book if editing
  useEffect(() => {
    if (bookId) {
      setLoading(true);
      API
        .get(`/books/${bookId}`)
        .then((res) => {
          const book = res.data.data?.book || res.data.data || res.data.book || res.data;
          setTitle(book.title || "");
          setAuthor(book.author || "");
          setDescription(book.description || "");
          setGenre(book.genre || "");
          setYear(book.year || "");
          setImage(book.cover || "");
        })
        .catch((err) => setError("Failed to load book data."))
        .finally(() => setLoading(false));
    }
  }, [bookId]);

  // Remove file upload handler

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const cover = image;
    const bookData = { title, author, description, genre, year, cover };
    try {
      if (bookId) {
        await API.put(`/books/${bookId}`, bookData);
      } else {
        await API.post("/books", bookData);
      }
      navigate("/books");
    } catch (err) {
      console.error(err);
      setError("Failed to save book. " + (err.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-display flex flex-col z-0">
      <main className="flex-grow flex items-center justify-center mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 mt-16 overflow-auto" style={{ maxHeight: '100vh' }}>
        <div className="space-y-8 w-full mt-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              {bookId ? "Edit Book" : "Add New Book"}
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              {bookId
                ? "Update the details below to edit the book."
                : "Fill in the details below to add a new book to the library."}
            </p>
          </div>

          {error && (
            <p className="text-red-500 font-medium">{error}</p>
          )}

          {loading ? (
            <p className="text-center text-lg">Loading...</p>
          ) : uploading ? (
            <p className="text-center text-lg">Uploading image...</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-lg bg-white dark:bg-background-dark/70 p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
            >
              {/* Book Cover Image Field (URL only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Book Cover Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-background-dark focus:border-primary focus:ring-primary/50 h-11 text-base placeholder-black text-black"
                  placeholder="Paste image URL (jpg, png, etc)"
                />
                {image && (
                  <img src={image} alt="Book cover preview" className="mt-2 h-32 rounded shadow border" />
                )}
              </div>

              {/* Title Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-background-dark focus:border-primary focus:ring-primary/50 h-11 text-base placeholder-black text-black"
                  placeholder="Enter book title"
                  required
                />
              </div>

              {/* Author Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-background-dark focus:border-primary focus:ring-primary/50 h-11 text-base placeholder-black text-black"
                  placeholder="Enter author's name"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="form-textarea w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-background-dark focus:border-primary focus:ring-primary/50 h-16 text-base placeholder-black text-black"
                  placeholder="Enter book description"
                  required
                />
              </div>

              {/* Genre and Year Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="form-select w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-background-dark focus:border-primary focus:ring-primary/50 h-11 text-base text-black placeholder-black"
                    required
                  >
                    <option value="">Select genre</option>
                    <option>Fantasy</option>
                    <option>Science Fiction</option>
                    <option>Dystopian</option>
                    <option>Action & Adventure</option>
                    <option>Mystery</option>
                    <option>Horror</option>
                    <option>Thriller & Suspense</option>
                    <option>Historical Fiction</option>
                    <option>Romance</option>
                    <option>Graphic Novel</option>
                    <option>Children’s</option>
                    <option>Memoir & Autobiography</option>
                    <option>Biography</option>
                    <option>Food & Drink</option>
                    <option>Art & Photography</option>
                    <option>Self-help</option>
                    <option>History</option>
                    <option>Travel</option>
                    <option>True Crime</option>
                    <option>Humor</option>
                    <option>Guide/How-to</option>
                    <option>Religion & Spirituality</option>
                    <option>Humanities & Social Sciences</option>
                    <option>Parenting & Families</option>
                    <option>Science & Technology</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="form-input w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-background-dark focus:border-primary focus:ring-primary/50 h-14 text-base placeholder-black text-black"
                    placeholder="Enter publication year"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="rounded-lg bg-orange-600 dark:bg-orange-800 px-8 py-4 text-lg font-extrabold text-white shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-orange-700 dark:hover:bg-orange-900 border-2 border-orange-500 dark:border-orange-700"
                >
                  {bookId ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookForm;
