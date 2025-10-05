import React, { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // <-- AuthContext integration

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  // Frontend validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name cannot be blank";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/signup", formData);

      // Save JWT
      localStorage.setItem("token", res.data.data.token);

      // Save user into AuthContext
      if (res.data.data.user) {
        login(res.data.data.user);
      }

  // Navigate to My Books page after signup
  navigate("/my-books");
    } catch (err) {
      console.log("[Signup] Failed to sign up:", err);
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-background-dark rounded-xl shadow-lg m-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Your Account
            </h1>
          </div>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                type="text"
                className="relative block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {error.name && (
                <p className="text-red-500 text-sm mt-1">{error.name}</p>
              )}
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="relative block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="relative block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>

            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="relative block w-full px-3 py-4 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {error.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {error.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-orange-700"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-black">
            <a
              className="font-medium text-black hover:text-gray-700"
              href="/login"
            >
              Already have an account? Log in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
