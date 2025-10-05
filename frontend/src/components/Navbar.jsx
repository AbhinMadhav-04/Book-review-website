import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // Debug: log user info
  console.log('[Navbar] user:', user);

  return (
    <header className="sticky top-0 z-10 w-full border-b border-orange-500/80 bg-orange-600 dark:border-orange-700/80 dark:bg-orange-800 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-3 text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h2 className="text-xl font-bold">BookVerse</h2>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
            >
              Home
            </button>
            {user && (
              <>
                <button
                  onClick={() => navigate("/books")}
                  className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
                >
                  Book List
                </button>
                <button
                  onClick={() => navigate("/mybooks")}
                  className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
                >
                  My Books
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search bar */}
        <div className="relative hidden sm:block">
        <input
        type="text"
        placeholder="Search"
        className="form-input h-10 w-full min-w-40 max-w-xs rounded-full border-slate-300 bg-slate-100 pl-10 text-sm placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary"
        />
       </div>


          {/* Login / Hello Full Name */}
          {user ? (
            <button
              onClick={() => navigate("/profile")}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              {`Hello ${user.fullName || user.name || user.email}`}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
