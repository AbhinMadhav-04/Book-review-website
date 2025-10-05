// get books added by current user with pagination
const getMyBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  try {
    const books = await Book.find({ addedBy: req.user._id })
      .select('title author description genre year cover addedBy createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'name email fullName');
    const total = await Book.countDocuments({ addedBy: req.user._id });
    res.json({ success: true, data: books, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const Book = require("../models/Book");
const Review = require("../models/Review");

// add book
const addBook = async (req, res) => {
  const { title, author, description, genre, year, cover } = req.body;
  if (!title || !author) {
    return res.status(400).json({ success: false, message: "Title and author required" });
  }
  try {
    const book = await Book.create({
      title, author, description, genre, year, cover, addedBy: req.user._id
    });
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// edit book
const editBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    // Only update allowed fields
    const updateFields = {};
    ["title", "author", "description", "genre", "year", "cover"].forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });
    const updated = await Book.findByIdAndUpdate(id, updateFields, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete book
const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    await book.deleteOne();
    res.json({ success: true, message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// list books with pagination
const getBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  try {
  const books = await Book.find()
    .select('title author description genre year cover addedBy createdAt updatedAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('addedBy', 'name email fullName');
    const total = await Book.countDocuments();
    res.json({ success: true, data: books, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get book by id with reviews & average rating
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id)
      .select('title author description genre year cover addedBy createdAt updatedAt')
      .populate("addedBy", "name email");
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    const reviews = await Review.find({ bookId: id }).populate("userId", "name");
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;
    res.json({ success: true, data: { book, reviews, avgRating } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addBook, editBook, deleteBook, getBooks, getBookById, getMyBooks };
