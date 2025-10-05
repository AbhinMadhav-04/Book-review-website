# Book Review Website

A full-stack web application for browsing, reviewing, and managing books. Users can sign up, log in, add/edit/delete their own books, and review books by others. Built with React, Express, and MongoDB.

## Features

- User authentication (signup, login, logout)
- Add, edit, and delete your own books
- Browse all books with pagination
- Add reviews (star rating + text) to any book
- See average rating and all reviews for each book
- Edit or delete your own reviews
- Book cover image via public image URL
- Responsive, modern UI with Tailwind CSS

## Tech Stack

- **Frontend:** React, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Book-Review-Website
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env` in the `backend/` folder and set your MongoDB URI and JWT secret.

5. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   # or: npm start
   ```

6. **Start the frontend dev server:**
   ```bash
   cd ../frontend
   npm run dev
   ```

7. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Usage
- Sign up and log in.
- Add books from "My Books".
- Browse all books, view details, and add reviews.
- Edit or delete your own books and reviews.

## Notes
- Book cover images must be public image URLs (e.g., from Unsplash, Imgur, etc.).
- File upload for images is not supported in this version.
- For production, set up secure environment variables and use a production-ready database.

## License
MIT
