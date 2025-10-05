const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addBook, editBook, deleteBook, getBooks, getBookById, getMyBooks } = require("../controllers/bookController");
router.get("/my", protect, getMyBooks); // get only current user's books

router.get("/", getBooks); // public
router.get("/:id", getBookById); // public
router.post("/", protect, addBook);
router.put("/:id", protect, editBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
