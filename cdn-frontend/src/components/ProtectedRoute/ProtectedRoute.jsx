// src/components/ProtectedRoute/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};




// import React, { createContext, useContext, useState } from 'react';
// import { Navigate } from 'react-router-dom';

// // Auth Context
// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (credentials) => {
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials)
//       });
      
//       if (!response.ok) throw new Error('Login failed');
      
//       const data = await response.json();
//       setUser(data.user);
//       localStorage.setItem('token', data.token);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Protected Route Component
// export const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   return user ? children : <Navigate to="/login" />;
// };

// // Login Component
// export const Login = () => {
//   const [credentials, setCredentials] = useState({ email: '', password: '' });
//   const { login } = useContext(AuthContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(credentials);
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 mb-4 border rounded"
//           onChange={e => setCredentials({...credentials, email: e.target.value})}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 mb-6 border rounded"
//           onChange={e => setCredentials({...credentials, password: e.target.value})}
//         />
//         <button 
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };