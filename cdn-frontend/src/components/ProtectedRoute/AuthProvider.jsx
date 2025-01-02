// // src/components/ProtectedRoute/AuthProvider.js
// import React, { createContext, useState, useEffect } from 'react';
// import { auth, googleProvider } from '../../firebase';
// import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   const loginWithGoogle = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       setUser(result.user);
//     } catch (error) {
//       console.error('Google login failed:', error);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// src/components/ProtectedRoute/AuthProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../../firebase';
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  getIdToken,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      navigate('/files');
    } catch (error) {
      setError(error.message);
      console.error('Google login failed:', error);
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/files');
    } catch (error) {
      setError(error.message);
      console.error('Email login failed:', error);
    }
  };

  const registerWithEmail = async (email, password) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/files');
    } catch (error) {
      setError(error.message);
      console.error('Registration failed:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      setError(error.message);
      console.error('Password reset failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      loginWithEmail,
      registerWithEmail,
      resetPassword,
      logout,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
