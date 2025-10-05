import BookList from "./pages/BookList";
  <Route path="/books" element={<BookList />} />
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import MyBooks from "./pages/MyBooks";
import AddEditBook from "./pages/AddEditBook";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* After login/signup → Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Books */}
  <Route path="/mybooks" element={<MyBooks />} />
        <Route path="/add-edit-book/:id?" element={<AddEditBook />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
