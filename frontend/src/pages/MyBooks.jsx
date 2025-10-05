
import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import AddBookCard from "../components/AddBookCard";

const MyBooks = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [books, setBooks] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);

	const PAGE_SIZE = 5;
	const fetchBooks = async (pageNumber = 1) => {
		setLoading(true);
		try {
			const res = await API.get(`/books/my?page=${pageNumber}&limit=${PAGE_SIZE}`);
			setBooks(res.data.data || []);
			setTotalPages(res.data.totalPages || 1);
			setPage(res.data.page || 1);
		} catch (err) {
			console.log("[MyBooks] Failed to fetch books:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBooks(1);
		// eslint-disable-next-line
	}, [user]);

	// When page changes, scroll to top of book list
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [page]);

	const handleViewDetails = (id) => navigate(`/books/${id}`);
	const handleEdit = (id) => navigate(`/add-edit-book/${id}`);
	const handleDelete = async (id) => {
			if (window.confirm("Are you sure you want to delete this book?")) {
				try {
					await API.delete(`/books/${id}`);
					fetchBooks(page);
				} catch (err) {
					console.log("[MyBooks] Failed to delete book:", err);
				}
			}
	};

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) fetchBooks(newPage);
	};

		// No client-side pagination needed, backend returns correct page
		const pageBooks = books;

		return (
			<div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">
				<main className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
					<h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">My Books</h1>

					{loading ? (
						<p className="text-center text-lg">Loading books...</p>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{pageBooks.map((item) => (
								<BookCard
									key={item._id}
									book={item}
									onEdit={handleEdit}
									onDelete={handleDelete}
									onView={handleViewDetails}
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

					{/* Add Book Button */}
					<div className="flex justify-center mt-6">
						<button
							onClick={() => navigate("/add-edit-book")}
							className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 shadow-md"
						>
							+ Add Book
						</button>
					</div>
				</main>
			</div>
		);
};

export default MyBooks;
