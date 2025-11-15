"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Home page for the business access portal. It introduces the tool and
 * provides a button to start the Facebook OAuth login flow. If the user
 * already has a valid token (checked by calling an API route), a continue
 * button is displayed to jump directly to the business selection.
 */
export default function HomePage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if a user access token exists by calling the businesses API.
    async function checkToken() {
      try {
        const res = await fetch('/api/me/businesses');
        setHasToken(res.ok);
      } catch {
        setHasToken(false);
      } finally {
        setChecking(false);
      }
    }
    checkToken();
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/facebook/login';
  };

  return (
    <div className="max-w-xl w-full mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">Business Access Portal</h1>
      <p className="text-gray-600 text-sm">
        This tool connects to my Facebook Business and Pages so I can manage assets and app subscriptions in one place.
      </p>
      <div className="space-y-4">
        <button
          onClick={handleLogin}
          className="w-full px-5 py-3 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-colors"
        >
          Connect with Facebook
        </button>
        {!checking && hasToken && (
          <button
            onClick={() => router.push('/select-business')}
            className="w-full px-5 py-3 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 transition-colors"
          >
            Continue to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}