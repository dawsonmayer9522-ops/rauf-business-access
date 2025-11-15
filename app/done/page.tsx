"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DonePage() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center flex-1 w-full p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Demo Completed</h1>
        <p className="text-gray-700">
          All requested permissions have been demonstrated in this session:
        </p>
        <ul className="list-disc list-inside text-left space-y-1">
          <li>
            <span className="font-mono">business_management</span> – used to list your businesses.
          </li>
          <li>
            <span className="font-mono">pages_show_list</span> – used to list your Pages for the selected business.
          </li>
          <li>
            <span className="font-mono">pages_manage_metadata</span> – used to subscribe this app to the selected Page.
          </li>
        </ul>
        <button
          onClick={() => router.push('/')}
          className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}