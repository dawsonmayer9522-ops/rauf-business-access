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

/**
 * Page for selecting a Facebook Page within a Business. It lists the pages
 * retrieved via the pages_show_list permission. A breadcrumb indicator
 * helps users understand their current step in the flow.
 */
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
        setError('We couldn\'t load your pages. Please confirm that you granted all requested permissions in Facebook.');
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
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-700 rounded">
        Step 2 of 3 – Select a Page for the chosen Business.
      </div>
      <div className="text-sm text-gray-500">
        Business → Pages → Page Settings
      </div>
      <h1 className="text-2xl font-semibold">Select a Page</h1>
      <p className="text-sm text-gray-600">
        Pages are loaded using the <span className="font-mono">pages_show_list</span> permission.
      </p>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && pages.length === 0 && !error && (
        <p className="text-gray-500">No pages were found for this business.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div key={page.id} className="bg-white rounded-lg shadow p-5 flex flex-col justify-between">
            <div className="flex items-center space-x-4 mb-4">
              {page.picture?.data?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={page.picture.data.url}
                  alt={page.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">N/A</div>
              )}
              <div>
                <h2 className="text-lg font-medium">{page.name}</h2>
                <p className="text-xs text-gray-500">Page ID: {page.id}</p>
              </div>
            </div>
            <button
              onClick={() => handleSelect(page.id)}
              className="mt-auto inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            >
              Manage Page
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}