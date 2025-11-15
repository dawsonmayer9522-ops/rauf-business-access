"use client";

import React, { useEffect, useState } from 'react';

/**
 * Topbar component displays the name of the portal and the connection
 * status to Facebook. It pings the `/api/me/businesses` endpoint on mount to
 * determine whether the user is authenticated (token exists). A loading state
 * is shown while the status is being determined.
 */
export default function Topbar() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'not-connected'>('checking');

  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch('/api/me/businesses');
        if (res.ok) {
          setStatus('connected');
        } else {
          setStatus('not-connected');
        }
      } catch {
        setStatus('not-connected');
      }
    }
    checkConnection();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="text-lg font-medium">Business Access Portal</div>
      <div className="text-sm text-gray-600">
        {status === 'checking' && 'Checking connection…'}
        {status === 'connected' && 'Connected to Facebook'}
        {status === 'not-connected' && 'Not connected'}
      </div>
    </header>
  );
}