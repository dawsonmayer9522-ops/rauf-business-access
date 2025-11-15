"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  match?: (pathname: string) => boolean;
}

/**
 * Sidebar navigation for the dashboard. Contains links to the main sections
 * of the app. The active link is highlighted based on the current URL.
 */
export default function Sidebar() {
  const pathname = usePathname();

  // Define navigation items. Each item can optionally define a custom match
  // function to determine if it should be considered active for a given
  // pathname (useful for routes with query parameters or nested paths).
  const navItems: NavItem[] = [
    {
      name: 'Home',
      href: '/',
      match: (path) => path === '/',
    },
    {
      name: 'Businesses',
      href: '/select-business',
      match: (path) => path.startsWith('/select-business'),
    },
    {
      name: 'Pages',
      href: '/select-page',
      match: (path) =>
        path.startsWith('/select-page') ||
        path.startsWith('/page-settings') ||
        path.startsWith('/done'),
    },
    {
      name: 'Settings',
      href: '#',
      match: () => false,
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 p-6 flex flex-col">
      {/* Logo / App name */}
      <div className="text-xl font-bold mb-10 leading-tight">
        Abdul Rauf
        <br />
        <span className="text-primary">Business Access</span>
      </div>
      {/* Navigation items */}
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = item.match ? item.match(pathname) : pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block rounded px-4 py-2 text-sm transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}