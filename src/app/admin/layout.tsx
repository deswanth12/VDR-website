// src/app/admin/layout.tsx
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'VDR Admin Portal | Vijaya Durga Refrigeration',
  description: 'Operations and Content Management System for Vijaya Durga Refrigeration showroom.',
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
