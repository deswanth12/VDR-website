// src/app/admin/login/page.tsx
'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Snowflake, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check credentials.');
      }

      // Success -> navigate to dashboard
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#072A47] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-[#0A3960] border border-[#0284C7]/40 items-center justify-center text-white shadow-md mx-auto">
            <Snowflake className="h-7 w-7 text-[#0284C7]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            VDR Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Vijaya Durga Refrigeration • Operations & CMS
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-white/10 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#0F172A] font-heading">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-[#475569]">
              Enter authorized administrator credentials to manage showroom inventory.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start gap-2 animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#0284C7]" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vijayadurgarefrigeration.com"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#0284C7]" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-3.5 pr-10 rounded-lg border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg bg-[#0A3960] hover:bg-[#072A47] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-[#475569] space-y-1">
            <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-[#0284C7]" />
              <span>Authorized Personnel Only</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Access is restricted to authorized showroom staff. All administrative actions and inventory modifications are authenticated and audited.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-400">
          Protected Showroom Workspace • Ravulapalem, AP
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#072A47] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-[#0284C7] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
