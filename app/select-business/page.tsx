"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Business {
  id: string;
  name: string;
}

export default function SelectBusinessPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const res = await fetch('/api/me/businesses');
        if (res.status === 401) {
          // Not authenticated; go back to home.
          router.push('/');
          return;
        }
        const data = await res.json();
        // Facebook Graph API returns an object with `data` array.
        setBusinesses(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        setError('Failed to load businesses');
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
    <main className="flex flex-col items-center justify-start flex-1 w-full p-4">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-2xl font-semibold text-center">Select Your Business</h1>
        <p className="text-sm text-gray-600 text-center">
          This uses the <span className="font-mono">business_management</span> permission.
        </p>
        {loading && <p className="text-center">Loading…</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && businesses.length === 0 && !error && (
          <p className="text-center text-gray-500">No businesses found for your account.</p>
        )}
        <div className="grid grid-cols-1 gap-4">
          {businesses.map((business) => (
            <div key={business.id} className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-medium">{business.name}</h2>
                <p className="text-xs text-gray-500">Business ID: {business.id}</p>
              </div>
              <button
                onClick={() => handleSelect(business.id)}
                className="mt-4 md:mt-0 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Select Business
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}