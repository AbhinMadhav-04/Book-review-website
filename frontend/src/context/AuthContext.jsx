import React, { createContext, useState } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if needed
  const [user, setUser] = useState(null); // null = not logged in

  // Login function: update user state
  const login = (userData) => {
    let fullName = userData.fullName;
    if (!fullName && userData.firstName && userData.lastName) {
      fullName = `${userData.firstName} ${userData.lastName}`;
    }
    setUser(fullName ? { ...userData, fullName } : userData);
  };

  // Logout function: clear user state
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
