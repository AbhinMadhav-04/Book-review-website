import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-slate-600 dark:text-slate-400">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display">
      <div className="max-w-md w-full bg-white dark:bg-background-dark/50 rounded-lg p-8 shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: '#111' }}>Profile</h2>
        <div className="space-y-2 mb-6">
          <div style={{ color: '#111' }}><strong>Name:</strong> {user.fullName || user.name || user.email}</div>
          <div style={{ color: '#111' }}><strong>Email:</strong> {user.email}</div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full mt-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
