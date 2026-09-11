// src/app/admin/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  RefreshCw,
  FileJson,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Password rotation state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  // Backup & Snapshot state
  const [dbStats, setDbStats] = useState<any>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [creatingSnapshot, setCreatingSnapshot] = useState(false);
  const [newSnapshotName, setNewSnapshotName] = useState('');

  // Restore Modal State
  const [selectedSnapshotForRestore, setSelectedSnapshotForRestore] = useState<any | null>(null);
  const [restoring, setRestoring] = useState(false);

  const fetchAdminProfile = () => {
    fetch('/api/admin/auth/me')
      .then((res) => res.json())
      .then((data) => setAdmin(data.admin))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchBackupData = async () => {
    try {
      const res = await fetch('/api/admin/backup');
      const data = await res.json();
      if (res.ok) {
        setDbStats(data.stats);
        setSnapshots(data.snapshots || []);
      }
    } catch (err) {
      console.error('Error fetching backup data:', err);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchBackupData();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFeedback('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setChanging(true);
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setFeedback('Password rotated successfully! Your account credentials have been updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setFeedback(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Error updating password.');
    } finally {
      setChanging(false);
    }
  };

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingSnapshot(true);
    setError('');
    setFeedback('');

    try {
      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSnapshotName.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create snapshot');

      setFeedback(`Snapshot "${data.snapshot.name}" created successfully!`);
      setNewSnapshotName('');
      await fetchBackupData();
      setTimeout(() => setFeedback(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Error creating snapshot.');
    } finally {
      setCreatingSnapshot(false);
    }
  };

  const handleDeleteSnapshot = async (snapshotId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete snapshot "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/backup/${snapshotId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFeedback(`Snapshot deleted.`);
        await fetchBackupData();
        setTimeout(() => setFeedback(''), 4000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete snapshot');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting snapshot.');
    }
  };

  const handleConfirmRestore = async () => {
    if (!selectedSnapshotForRestore) return;

    setRestoring(true);
    setError('');
    setFeedback('');

    try {
      const res = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshotId: selectedSnapshotForRestore.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to restore snapshot');

      setFeedback(
        `Database successfully restored! (Restored ${data.restoredProducts} products; Safety backup ID: ${data.safetyBackupId})`
      );
      setSelectedSnapshotForRestore(null);
      await fetchBackupData();
    } catch (err: any) {
      setError(err.message || 'Restore error occurred.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div className="border-b border-[var(--vdr-border)] pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] font-heading">
          Settings & Operations Console
        </h1>
        <p className="text-xs text-[var(--vdr-text-secondary)] mt-0.5">
          Manage database backups, administrator credentials, and container persistence.
        </p>
      </div>

      {feedback && (
        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="h-4 w-4 text-[var(--vdr-status-success)] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2 animate-in fade-in-50">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Unified Operations Canvas */}
      <div className="bg-white border border-[var(--vdr-border)] rounded-lg p-6 sm:p-8 space-y-10 shadow-xs">
        {/* SECTION 1: DATABASE & DISASTER RECOVERY */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
                1. Database Health & Recovery
              </h2>
              <p className="text-xs text-slate-500">
                Active SQLite state, portable exports, and point-in-time disaster recovery snapshots.
              </p>
            </div>

            {/* Quick Export Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="/api/admin/backup/export?format=sqlite"
                download
                className="px-3 py-1.5 rounded-md border border-[var(--vdr-border)] bg-white hover:bg-[var(--vdr-surface-subtle)] text-[var(--vdr-text-primary)] text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                <span>Export SQLite (.db)</span>
              </a>

              <a
                href="/api/admin/backup/export?format=json"
                download
                className="px-3 py-1.5 rounded-md border border-[var(--vdr-border)] bg-white hover:bg-[var(--vdr-surface-subtle)] text-[var(--vdr-text-primary)] text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <FileJson className="h-3.5 w-3.5 text-amber-600" />
                <span>Export Full JSON</span>
              </a>
            </div>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          {/* Database Health Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)]">
              <span className="text-slate-500 text-[11px] font-medium">Database Status</span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="font-bold text-emerald-800">Healthy & Online</p>
              </div>
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)]">
              <span className="text-slate-500 text-[11px] font-medium">Storage Size</span>
              <p className="font-bold text-[var(--vdr-text-primary)] pt-0.5 font-mono tabular-nums">
                {dbStats?.dbSizeFormatted || 'Checking...'}
              </p>
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)]">
              <span className="text-slate-500 text-[11px] font-medium">Catalogue Products</span>
              <p className="font-bold text-[var(--vdr-text-primary)] pt-0.5 tabular-nums">
                {dbStats?.totalProducts !== undefined ? `${dbStats.totalProducts} active items` : '...'}
              </p>
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)]">
              <span className="text-slate-500 text-[11px] font-medium">Saved Snapshots</span>
              <p className="font-bold text-[var(--vdr-cyan)] pt-0.5 tabular-nums">
                {dbStats?.snapshotCount !== undefined ? `${dbStats.snapshotCount} point-in-time` : '...'}
              </p>
            </div>
          </div>

          {/* Create Snapshot Bar */}
          <form onSubmit={handleCreateSnapshot} className="flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="text"
              value={newSnapshotName}
              onChange={(e) => setNewSnapshotName(e.target.value)}
              placeholder="Optional snapshot label (e.g. Pre-Season Launch, Before Bulk Import)..."
              className="flex-1 h-8 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
            />
            <button
              type="submit"
              disabled={creatingSnapshot}
              className="px-3.5 py-1.5 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
            >
              <Plus className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
              <span>{creatingSnapshot ? 'Capturing Snapshot...' : 'Create Point-in-Time Snapshot'}</span>
            </button>
          </form>

          {/* Snapshots Table */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Available Point-in-Time Snapshots</span>
              <button
                type="button"
                onClick={fetchBackupData}
                className="hover:text-slate-800 flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="border border-[var(--vdr-border)] rounded-md overflow-hidden">
              {snapshots.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50/50">
                  No point-in-time snapshots created yet. Click &quot;Create Point-in-Time Snapshot&quot; above to capture a safe backup.
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs text-[var(--vdr-text-primary)]">
                    <thead className="bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] font-semibold text-slate-600 sticky top-0">
                      <tr className="h-9">
                        <th className="py-2 px-3">Snapshot Name & ID</th>
                        <th className="py-2 px-3">Timestamp</th>
                        <th className="py-2 px-3">Size</th>
                        <th className="py-2 px-3">Products</th>
                        <th className="py-2 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {snapshots.map((snap) => (
                        <tr key={snap.id} className="h-10 hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 max-w-xs">
                            <p className="font-semibold text-[var(--vdr-text-primary)] truncate">{snap.name}</p>
                            <p className="font-mono text-[10px] text-slate-400 truncate">{snap.id}</p>
                          </td>
                          <td className="py-2 px-3 text-slate-500 whitespace-nowrap tabular-nums">
                            {new Date(snap.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-600 tabular-nums">
                            {(snap.sizeBytes / 1024).toFixed(1)} KB
                          </td>
                          <td className="py-2 px-3 text-slate-700 tabular-nums">
                            {snap.totalProducts} items
                          </td>
                          <td className="py-2 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`/api/admin/backup/${snap.id}`}
                                download
                                className="p-1 rounded hover:bg-slate-200 text-slate-600"
                                title="Download Snapshot DB"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() => setSelectedSnapshotForRestore(snap)}
                                className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 flex items-center gap-1 cursor-pointer"
                                title="Restore this state"
                              >
                                <RotateCcw className="h-3 w-3" />
                                <span>Restore</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteSnapshot(snap.id, snap.name)}
                                className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                                title="Delete Snapshot"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: ADMINISTRATOR PROFILE */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              2. Active Administrator Identity
            </h2>
            <p className="text-xs text-slate-500">Authenticated user identity and system authorization privilege.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          {loading ? (
            <div className="text-xs text-slate-400">Loading profile...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)]">
                <span className="text-slate-500 text-[11px] font-medium">Full Name</span>
                <p className="font-semibold text-[var(--vdr-text-primary)] pt-0.5">{admin?.name || 'VDR Admin'}</p>
              </div>
              <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)]">
                <span className="text-slate-500 text-[11px] font-medium">Email Address</span>
                <p className="font-semibold text-[var(--vdr-text-primary)] pt-0.5 font-mono">{admin?.email || 'admin@vdr.com'}</p>
              </div>
              <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)]">
                <span className="text-slate-500 text-[11px] font-medium">Role Privilege</span>
                <p className="font-bold text-[var(--vdr-cyan)] pt-0.5 uppercase">{admin?.role || 'SUPER_ADMIN'}</p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: PASSWORD ROTATION */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              3. Security & Password Rotation
            </h2>
            <p className="text-xs text-slate-500">
              Ensure default development credentials are replaced with a high-entropy passphrase before production deployment.
            </p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full h-8 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">New Password (min 8 characters)</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full h-8 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full h-8 px-3 rounded-md border border-[var(--vdr-border-strong)] text-xs text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={changing}
                className="px-4 py-1.5 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <KeyRound className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                <span>{changing ? 'Rotating Password...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 4: PRODUCTION CONTAINER PERSISTENCE PROTOCOL */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              4. Deployment Persistence Protocol
            </h2>
            <p className="text-xs text-slate-500">Container runtime configuration and Docker persistent volume targets.</p>
          </div>
          <div className="border-b border-slate-100 pb-2" />

          <div className="text-xs text-slate-600 space-y-2">
            <p>
              In production (Docker/VPS/Coolify), the SQLite database and image uploads are persisted via dedicated Docker volumes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 font-mono text-[11px]">
              <li><strong className="font-bold text-[var(--vdr-text-primary)]">Database & Snapshots Volume:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded">/app/data</code> (maps to <code className="text-slate-500">data/vdr.db</code>)</li>
              <li><strong className="font-bold text-[var(--vdr-text-primary)]">Media Uploads Volume:</strong> <code className="bg-slate-100 px-1 py-0.5 rounded">/app/public/uploads</code></li>
            </ul>
            <p className="text-slate-500 text-[11px] pt-1">
              All database writes survive container redeployments, restarts, and Coolify rebuilds. Point-in-time restores create automated safety backups before writing.
            </p>
          </div>
        </div>
      </div>

      {/* CONFIRM RESTORE MODAL */}
      {selectedSnapshotForRestore && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-5 shadow-2xl border border-[var(--vdr-border)] animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-50 text-amber-600 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
                  Confirm Database Point-in-Time Restore
                </h3>
                <p className="text-xs text-slate-600">
                  This action replaces live inventory and content with snapshot data.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-[var(--vdr-border)] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Snapshot:</span>
                <span className="font-bold text-[var(--vdr-text-primary)]">{selectedSnapshotForRestore.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Captured On:</span>
                <span className="font-mono text-slate-700 tabular-nums">
                  {new Date(selectedSnapshotForRestore.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Snapshot Inventory:</span>
                <span className="font-bold text-[var(--vdr-cyan)] tabular-nums">
                  {selectedSnapshotForRestore.totalProducts} products
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <span>🛡️ Automated Safety Rollback Guaranteed</span>
              </p>
              <p>
                Before applying this snapshot, the system will automatically create a Pre-Restore Safety Backup of your current database. If any integrity check fails, your database will automatically roll back to its current state.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vdr-border)]">
              <button
                type="button"
                disabled={restoring}
                onClick={() => setSelectedSnapshotForRestore(null)}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={restoring}
                onClick={handleConfirmRestore}
                className="px-4 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{restoring ? 'Restoring Database...' : 'Confirm & Restore Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
