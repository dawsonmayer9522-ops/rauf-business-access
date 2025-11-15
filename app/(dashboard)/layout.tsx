import React from 'react';
import Layout from '@/components/Layout';

/**
 * Dashboard layout wraps all pages in the `(dashboard)` group with a consistent
 * sidebar and top bar. The children will be rendered in the main content area.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}