// src/components/admin/AdminLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Snowflake,
  LayoutDashboard,
  Package,
  Layers,
  Award,
  MessageSquare,
  Building,
  Sliders,
  ExternalLink,
  LogOut,
  Menu,
  X,
  KeyRound,
  Upload,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then((data) => {
        if (data.admin?.name) {
          setAdminName(data.admin.name);
        }
      })
      .catch(() => {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      });
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Bulk Import', href: '/admin/import', icon: Upload },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Brands', href: '/admin/brands', icon: Award },
    { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { label: 'Business Info', href: '/admin/business', icon: Building },
    { label: 'Homepage Content', href: '/admin/homepage', icon: Sliders },
    { label: 'Security & Settings', href: '/admin/settings', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-[var(--vdr-canvas)] flex flex-col md:flex-row text-[var(--vdr-text-primary)]">
      {/* 1. SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex md:w-64 flex-col bg-[var(--vdr-navy)] text-white shrink-0 shadow-lg">
        {/* Brand Bar */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-white/10">
          <div className="h-9 w-9 rounded-lg bg-[var(--vdr-navy-hover)] flex items-center justify-center text-white border border-[var(--vdr-cyan)]/40 shadow-xs">
            <Snowflake className="h-5 w-5 text-[var(--vdr-cyan)]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-heading font-extrabold text-sm tracking-tight text-white leading-tight truncate">
              VDR Admin
            </span>
            <span className="text-[10px] text-slate-300 tracking-wider uppercase font-mono">
              Showroom CMS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[var(--vdr-cyan)] text-white shadow-xs font-bold'
                    : 'text-slate-200 hover:bg-[var(--vdr-navy-hover)] hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[var(--vdr-cyan)]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Website & Admin Footer */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
              <span>Public Storefront</span>
            </span>
            <span className="text-[10px] bg-[var(--vdr-navy-hover)] px-1.5 py-0.5 rounded text-slate-300">Live</span>
          </Link>

          <div className="pt-2 flex items-center justify-between px-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <div className="h-6 w-6 rounded-full bg-[var(--vdr-cyan)] flex items-center justify-center text-white text-[10px] font-bold">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[110px] text-xs font-medium">{adminName}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              title="Sign Out"
              className="p-1.5 rounded hover:bg-red-900/40 text-slate-300 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <header className="md:hidden bg-[var(--vdr-navy)] text-white px-4 h-16 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded bg-[var(--vdr-navy-hover)] flex items-center justify-center border border-[var(--vdr-cyan)]/30">
            <Snowflake className="h-4 w-4 text-[var(--vdr-cyan)]" />
          </div>
          <span className="font-heading font-extrabold text-sm text-white">VDR Admin</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[var(--vdr-navy-hover)] border border-white/10 text-white"
            aria-label="Toggle admin navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-[var(--vdr-cyan)]" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--vdr-navy-hover)] text-white px-4 py-4 space-y-1.5 border-b border-white/10 fixed top-16 left-0 right-0 z-40 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[var(--vdr-cyan)] text-white font-bold' : 'text-slate-200 hover:bg-[var(--vdr-navy)]'
                }`}
              >
                <Icon className="h-4 w-4 text-[var(--vdr-cyan)]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-xs text-slate-300 py-2 min-h-[44px]"
            >
              <ExternalLink className="h-4 w-4 text-[var(--vdr-cyan)]" />
              <span>Open Public Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-2 min-h-[44px] rounded-lg bg-red-950/60 text-red-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
