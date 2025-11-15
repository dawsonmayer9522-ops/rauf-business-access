"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Final summary page. It lists how each Facebook permission was used during the flow
 * and provides actions to restart or pick another business.
 */
export default function DonePage() {
  const router = useRouter();
  return (
    <div className="space-y-6 max-w-xl w-full">
      <h1 className="text-2xl font-semibold">Summary</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-2">
        <p>All requested permissions have been demonstrated in this session:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <span className="font-mono">business_management</span> – used to retrieve my Business accounts.
          </li>
          <li>
            <span className="font-mono">pages_show_list</span> – used to retrieve the Pages inside the selected Business.
          </li>
          <li>
            <span className="font-mono">pages_manage_metadata</span> – used to subscribe this application to my chosen Page.
          </li>
        </ul>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={() => router.push('/')}
          className="px-5 py-3 bg-primary text-white rounded hover:bg-primary/90 text-sm"
        >
          Back to Start
        </button>
        <button
          onClick={() => router.push('/select-business')}
          className="px-5 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          Choose Another Business
        </button>
      </div>
    </div>
  );
}