"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Business {
  id: string;
  name: string;
}

/**
 * Page for selecting a business account. Fetches the list of businesses
 * associated with the authenticated user using the business_management
 * permission. Presents each business in a card with an action to open it.
 */
export default function SelectBusinessPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const res = await fetch('/api/me/businesses');
        if (res.status === 401) {
          // Token expired or not present; redirect back to home.
          router.push('/');
          return;
        }
        const data = await res.json();
        setBusinesses(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        setError('We couldn\'t load your businesses. Please confirm that you granted all requested permissions in Facebook.');
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, [router]);

  const handleSelect = (id: string) => {
    router.push(`/select-page?business_id=${encodeURIComponent(id)}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-700 rounded">
        Step 1 of 3 – Choose which Business you want to work with.
      </div>
      <h1 className="text-2xl font-semibold">Select a Business Account</h1>
      <p className="text-sm text-gray-600">
        These Business accounts are loaded using the <span className="font-mono">business_management</span> permission.
      </p>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && businesses.length === 0 && !error && (
        <p className="text-gray-500">No businesses were found for your account.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((business) => (
          <div key={business.id} className="bg-white rounded-lg shadow p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-medium">{business.name}</h2>
              <p className="text-xs text-gray-500">Business ID: {business.id}</p>
            </div>
            <button
              onClick={() => handleSelect(business.id)}
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            >
              Open Business
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}