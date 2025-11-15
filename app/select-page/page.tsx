"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PageItem {
  id: string;
  name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

export default function SelectPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('business_id');
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPages() {
      if (!businessId) {
        setError('Missing business ID.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/business/${businessId}/pages`);
        if (res.status === 401) {
          router.push('/');
          return;
        }
        const data = await res.json();
        setPages(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        setError('Failed to load pages');
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, [businessId, router]);

  const handleSelect = (pageId: string) => {
    router.push(`/page-settings?page_id=${encodeURIComponent(pageId)}`);
  };

  return (
    <main className="flex flex-col items-center justify-start flex-1 w-full p-4">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-2xl font-semibold text-center">Select a Page</h1>
        <p className="text-sm text-gray-600 text-center">
          This list comes from the <span className="font-mono">pages_show_list</span> permission.
        </p>
        {loading && <p className="text-center">Loading…</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && pages.length === 0 && !error && (
          <p className="text-center text-gray-500">No pages found for this business.</p>
        )}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {pages.map((page) => (
            <div key={page.id} className="bg-white shadow rounded p-4 flex flex-col">
              {page.picture?.data?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={page.picture.data.url} alt={page.name} className="w-16 h-16 mb-2 rounded-full object-cover" />
              )}
              <h2 className="text-lg font-medium">{page.name}</h2>
              <p className="text-xs text-gray-500 mb-4">Page ID: {page.id}</p>
              <button
                onClick={() => handleSelect(page.id)}
                className="mt-auto inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Manage Page
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}