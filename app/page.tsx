"use client";

import React from 'react';

/**
 * Home page. Displays a description of the demo and a button to kick off the Facebook login flow.
 */
export default function HomePage() {
  const handleLogin = () => {
    // Redirect to our own API route that builds the Facebook OAuth URL.
    window.location.href = '/api/auth/facebook/login';
  };

  return (
    <main className="flex flex-col items-center justify-center flex-1 w-full p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-semibold">Abdul Rauf Business Access – Demo</h1>
        <p className="text-sm text-gray-700">
          This internal tool connects to my own Facebook Business and Pages to demonstrate
          specific permissions for Meta App Review.
        </p>
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-colors"
        >
          Login with Facebook
        </button>
      </div>
    </main>
  );
}