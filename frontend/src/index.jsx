import BookList from "./pages/BookList";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import BookDetails from "./pages/BookDetails";
import AddEditBook from "./pages/AddEditBook";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import Profile from "./pages/Profile";
import "./index.css";

const AppWrapper = () => {
  return (
    <AuthProvider> {/* Wrap the entire app in AuthProvider */}
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar /> {/* Navbar can now access auth context */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mybooks" element={<MyBooks />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:bookId" element={<BookDetails />} />
              <Route path="/add-edit-book/:bookId?" element={<AddEditBook />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
export default AppWrapper;