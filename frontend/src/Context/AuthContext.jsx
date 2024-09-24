import React, { createContext, useEffect, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext(null);

const AuthProvider = (props) => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state

  // Function to log in the user
  const login = async (email, password) => {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('auth-token', data.token); // Store the token
      setUser(data.user); // Set user data
    } else {
      console.error(data.message); // Handle login error
    }
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('auth-token');
    setUser(null); // Clear user data
  };

  // Effect to check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      // Optional: Fetch user data if token exists
      fetch('http://localhost:4000/fetchUser', {
        headers: {
          'auth-token': token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data.user);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const contextValue = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
