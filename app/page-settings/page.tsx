"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PageDetails {
  id: string;
  name: string;
  link?: string;
  fan_count?: number;
  category?: string;
}

export default function PageSettings() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get('page_id');
  const router = useRouter();
  const [details, setDetails] = useState<PageDetails | null>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!pageId) {
        setError('Missing page ID.');
        setLoading(false);
        return;
      }
      try {
        // Fetch page details
        const detailsRes = await fetch(`/api/page/${pageId}/details`);
        if (detailsRes.status === 401) {
          router.push('/');
          return;
        }
        const detailsData = await detailsRes.json();
        setDetails(detailsData);
        // Fetch subscription status
        const subRes = await fetch(`/api/page/${pageId}/subscription-status`);
        if (subRes.status === 200) {
          const subData = await subRes.json();
          // Graph API returns array under data
          const isSub = Array.isArray(subData?.data) && subData.data.length > 0;
          setSubscribed(isSub);
        }
      } catch (err) {
        setError('Failed to load page data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pageId, router]);

  const handleSubscribe = async () => {
    if (!pageId) return;
    setSubscribeLoading(true);
    try {
      const res = await fetch(`/api/page/${pageId}/subscribe`, {
        method: 'POST',
      });
      if (res.status === 401) {
        router.push('/');
        return;
      }
      if (res.ok) {
        setSubscribed(true);
      } else {
        const data = await res.json();
        alert(data?.error || 'Failed to subscribe');
      }
    } catch (err) {
      alert('Failed to subscribe');
    } finally {
      setSubscribeLoading(false);
    }
  };

  if (loading) {
    return <p className="p-4 text-center">Loading…</p>;
  }
  if (error) {
    return <p className="p-4 text-center text-red-500">{error}</p>;
  }
  if (!details) {
    return <p className="p-4 text-center text-gray-500">Page not found.</p>;
  }

  return (
    <main className="flex flex-col items-center justify-start flex-1 w-full p-4">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-2xl font-semibold text-center">Page Settings</h1>
        <div className="bg-white shadow rounded p-4 space-y-2">
          <h2 className="text-lg font-medium">Page Name: {details.name}</h2>
          <p className="text-sm text-gray-600">Page ID: {details.id}</p>
          {details.link && (
            <p className="text-sm text-blue-600 hover:underline">
              <a href={details.link} target="_blank" rel="noopener noreferrer">
                Page Link
              </a>
            </p>
          )}
          {typeof details.fan_count !== 'undefined' && (
            <p className="text-sm text-gray-600">Followers: {details.fan_count}</p>
          )}
          {details.category && (
            <p className="text-sm text-gray-600">Category: {details.category}</p>
          )}
        </div>
        <div className="bg-white shadow rounded p-4 space-y-4">
          <h3 className="text-lg font-medium">Metadata Subscription</h3>
          {!subscribed ? (
            <>
              <p className="text-sm text-gray-600">
                This uses the <span className="font-mono">pages_manage_metadata</span> permission.
              </p>
              <button
                onClick={handleSubscribe}
                disabled={subscribeLoading}
                className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
              >
                {subscribeLoading ? 'Subscribing…' : 'Subscribe App to This Page'}
              </button>
            </>
          ) : (
            <button
              disabled
              className="w-full px-4 py-2 bg-green-500 text-white rounded cursor-not-allowed"
            >
              Subscribed ✔
            </button>
          )}
        </div>
        <div className="text-center">
          <button
            onClick={() => router.push('/done')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}