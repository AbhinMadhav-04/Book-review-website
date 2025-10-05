const Review = require("../models/Review");

// add review
const addReview = async (req, res) => {
  const { bookId, rating, reviewText } = req.body;
  if (!bookId || !rating) return res.status(400).json({ success: false, message: "Book and rating required" });
  if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: "Rating 1-5 only" });
  try {
    const review = await Review.create({
      bookId, rating, reviewText, userId: req.user._id
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// edit review
const editReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Not allowed" });
    const updated = await Review.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete review
const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    if (review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: "Not allowed" });
    await review.deleteOne();
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addReview, editReview, deleteReview };
