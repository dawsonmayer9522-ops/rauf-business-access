"use client";

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * The main layout component used by all dashboard pages. It renders a persistent
 * sidebar on the left and a top bar at the top of the content area. The main
 * content of each page is displayed inside a scrollable container.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Content area */}
      <div className="flex flex-col flex-1">
        {/* Top bar */}
        <Topbar />
        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}