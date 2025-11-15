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

/**
 * Page settings screen. Displays a page overview and allows the user to
 * subscribe the application to the selected page using the
 * pages_manage_metadata permission.
 */
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
        if (subRes.ok) {
          const subData = await subRes.json();
          const isSub = Array.isArray(subData?.data) && subData.data.length > 0;
          setSubscribed(isSub);
        }
      } catch (err) {
        setError('We couldn\'t load this page. Please confirm that you granted all requested permissions in Facebook.');
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
    } catch {
      alert('Failed to subscribe');
    } finally {
      setSubscribeLoading(false);
    }
  };

  if (loading) {
    return <p>Loading…</p>;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  if (!details) {
    return <p className="text-gray-500">Page not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-700 rounded">
        Step 3 of 3 – Configure Page settings and subscribe this app.
      </div>
      <div className="text-sm text-gray-500">
        Business → Pages → Page Settings
      </div>
      <h1 className="text-2xl font-semibold">Page Settings</h1>
      {/* Page overview */}
      <div className="bg-white rounded-lg shadow p-6 space-y-2">
        <h2 className="text-lg font-medium mb-2">Page Overview</h2>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-semibold">Name:</span> {details.name}
          </p>
          <p>
            <span className="font-semibold">Page ID:</span> {details.id}
          </p>
          {details.link && (
            <p>
              <span className="font-semibold">Link:</span>{' '}
              <a
                href={details.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open on Facebook
              </a>
            </p>
          )}
          {typeof details.fan_count !== 'undefined' && (
            <p>
              <span className="font-semibold">Followers:</span> {details.fan_count}
            </p>
          )}
          {details.category && (
            <p>
              <span className="font-semibold">Category:</span> {details.category}
            </p>
          )}
        </div>
      </div>
      {/* Subscription card */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-medium">App Subscription on This Page</h2>
        <p className="text-sm text-gray-600">
          Here I can subscribe this application to my Page. This uses the{' '}
          <span className="font-mono">pages_manage_metadata</span> permission.
        </p>
        {!subscribed ? (
          <button
            onClick={handleSubscribe}
            disabled={subscribeLoading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 text-sm"
          >
            {subscribeLoading ? 'Subscribing…' : 'Subscribe App to This Page'}
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              disabled
              className="px-4 py-2 bg-green-500 text-white rounded text-sm cursor-not-allowed"
            >
              App is Subscribed ✔
            </button>
            <span className="text-green-600 text-sm">This application is currently subscribed to this Page.</span>
          </div>
        )}
      </div>
      {/* Continue button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => router.push('/done')}
          className="px-5 py-3 bg-primary text-white rounded hover:bg-primary/90 text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
}