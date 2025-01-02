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
import { signInWithPopup, onAuthStateChanged, signOut, getIdToken } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        getIdToken(user).then((idToken) => {
          setToken(idToken);
        });
      } else {
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      const idToken = await getIdToken(result.user);
      setToken(idToken);
      console.log('Login successful:', result.user);
      navigate('/files'); // Redirect to the home page or dashboard after login
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      console.log('Logout successful');
      navigate('/login'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
