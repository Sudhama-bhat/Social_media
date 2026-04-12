import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Decode JWT payload (no external library needed)
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser({ id: decoded.id, name: decoded.name, token });
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    const decoded = decodeToken(token);
    if (decoded) {
      const userData = { id: decoded.id, name: decoded.name, token };
      setUser(userData);
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
