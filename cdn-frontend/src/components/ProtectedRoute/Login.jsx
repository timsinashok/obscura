// src/components/ProtectedRoute/Login.js
import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export const Login = () => {
  const { loginWithGoogle } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <button
          onClick={loginWithGoogle}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
