// src/app/admin/import/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface PreviewRow {
  rowNumber: number;
  raw: Record<string, string>;
  normalized: Record<string, any>;
  status: 'valid' | 'warning' | 'error';
  isUpdate: boolean;
  matchReason?: string;
  errors: string[];
  warnings: string[];
}

interface PreviewData {
  totalRows: number;
  validCount: number;
  newCount: number;
  updateCount: number;
  errorCount: number;
  headers: string[];
  recognizedColumns: string[];
  rows: PreviewRow[];
}

export default function AdminImportPage() {
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [duplicateStrategy, setDuplicateStrategy] = useState<'update' | 'skip'>('update');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string; details?: any } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      handleAnalyze(content);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async (textToAnalyze?: string) => {
    const content = textToAnalyze !== undefined ? textToAnalyze : csvText;
    if (!content.trim()) {
      setFeedback({ type: 'error', message: 'Please provide CSV spreadsheet content to import.' });
      return;
    }

    setAnalyzing(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/import/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze CSV');

      setPreviewData(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error processing CSV' });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCommit = async () => {
    if (!previewData) return;

    setCommitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/import/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvContent: csvText,
          duplicateStrategy,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to commit import');

      setFeedback({
        type: 'success',
        message: `Catalogue import completed successfully! Created ${data.created} new products, updated ${data.updated} existing items.`,
        details: data,
      });

      setPreviewData(null);
      setCsvText('');
      setFileName('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Import commit failed' });
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--vdr-border)] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--vdr-text-primary)] font-heading">
            Bulk Catalogue Ingestion
          </h1>
          <p className="text-xs text-[var(--vdr-text-secondary)] mt-0.5">
            Import real manufacturer spreadsheets with column normalization, duplicate detection, and atomic commit.
          </p>
        </div>

        <a
          href="/api/admin/import/template"
          download="vdr_catalogue_template.csv"
          className="px-3.5 py-2 rounded-md border border-[var(--vdr-border)] bg-white hover:bg-[var(--vdr-surface-subtle)] text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Download className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
          <span>Download Standard Template (.CSV)</span>
        </a>
      </div>

      {/* Notifications */}
      {feedback && (
        <div
          className={`rounded-md p-3.5 text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-[var(--vdr-status-success)] shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <div className="flex-1 font-medium">{feedback.message}</div>
          {feedback.type === 'success' && (
            <Link
              href="/admin/products"
              className="px-2 py-1 rounded bg-[var(--vdr-navy)] text-white text-[11px] font-bold shrink-0 hover:bg-[var(--vdr-navy-hover)]"
            >
              View Inventory →
            </Link>
          )}
        </div>
      )}

      {/* Step 1: Upload & Paste Zone */}
      {!previewData && (
        <div className="bg-white border border-[var(--vdr-border)] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
              1. Upload Client Catalogue File
            </h2>
            <p className="text-xs text-slate-500">Select a CSV document or paste raw comma-separated spreadsheet data.</p>
          </div>
          <div className="border-b border-slate-100 pb-1" />

          {/* Focused Drag & Drop Upload Zone */}
          <div className="border-2 border-dashed border-[var(--vdr-border-strong)] hover:border-[var(--vdr-cyan)] transition-colors rounded-lg p-8 text-center space-y-3 bg-slate-50/60">
            <Upload className="h-8 w-8 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <label className="cursor-pointer text-xs font-bold text-[var(--vdr-cyan)] hover:underline">
                <span>Choose a .CSV file to upload</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500">
                {fileName ? (
                  <span className="font-bold text-slate-800">Selected: {fileName}</span>
                ) : (
                  'Supports comma-separated CSV with auto-header normalization'
                )}
              </p>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[var(--vdr-border)]"></div>
            <span className="flex-shrink mx-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              or paste CSV data directly
            </span>
            <div className="flex-grow border-t border-[var(--vdr-border)]"></div>
          </div>

          {/* Raw Textarea */}
          <div className="space-y-2">
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Paste raw CSV text here with headers (e.g. name, brand, category, model, sku, capacity, star, features, specs)..."
              className="w-full p-3 rounded-md border border-[var(--vdr-border-strong)] text-xs font-mono text-[var(--vdr-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--vdr-cyan)]"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={analyzing || !csvText.trim()}
              onClick={() => handleAnalyze()}
              className="px-4 py-2 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {analyzing ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Validating CSV Structure...</span>
                </>
              ) : (
                <>
                  <span>Validate & Preview Rows</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Interactive Validation & Preview */}
      {previewData && (
        <div className="bg-white border border-[var(--vdr-border)] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[var(--vdr-text-primary)] font-heading">
                Spreadsheet Validation Preview
              </h2>
              <p className="text-xs text-slate-500">
                Verify recognized columns, duplicate SKU matches, and validation status.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPreviewData(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              ← Choose another file
            </button>
          </div>

          {/* Validation Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="p-3 rounded-md bg-slate-50 border border-[var(--vdr-border)]">
              <span className="text-slate-500 text-[11px] font-medium">Total Rows</span>
              <p className="font-bold text-[var(--vdr-text-primary)] text-lg tabular-nums">{previewData.totalRows}</p>
            </div>
            <div className="p-3 rounded-md bg-emerald-50/60 border border-emerald-200">
              <span className="text-emerald-700 text-[11px] font-medium">Valid Ready</span>
              <p className="font-bold text-emerald-700 text-lg tabular-nums">{previewData.validCount}</p>
            </div>
            <div className="p-3 rounded-md bg-blue-50/60 border border-blue-200">
              <span className="text-blue-700 text-[11px] font-medium">Net New Items</span>
              <p className="font-bold text-[var(--vdr-cyan)] text-lg tabular-nums">{previewData.newCount}</p>
            </div>
            <div className="p-3 rounded-md bg-amber-50/60 border border-amber-200">
              <span className="text-amber-700 text-[11px] font-medium">Existing Updates</span>
              <p className="font-bold text-amber-700 text-lg tabular-nums">{previewData.updateCount}</p>
            </div>
            <div className="p-3 rounded-md bg-red-50/60 border border-red-200">
              <span className="text-red-700 text-[11px] font-medium">Errors / Missing</span>
              <p className="font-bold text-red-600 text-lg tabular-nums">{previewData.errorCount}</p>
            </div>
          </div>

          {/* Duplicate Strategy Option */}
          <div className="p-3.5 rounded-md bg-slate-50 border border-[var(--vdr-border)] space-y-1.5 text-xs">
            <span className="font-bold text-[var(--vdr-text-primary)]">Duplicate Matching Strategy:</span>
            <div className="flex flex-col sm:flex-row gap-4 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="radio"
                  name="dupStrategy"
                  checked={duplicateStrategy === 'update'}
                  onChange={() => setDuplicateStrategy('update')}
                  className="text-[var(--vdr-navy)] focus:ring-[var(--vdr-cyan)]"
                />
                <span>Update existing items (Overwrites specifications & media with new sheet)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="radio"
                  name="dupStrategy"
                  checked={duplicateStrategy === 'skip'}
                  onChange={() => setDuplicateStrategy('skip')}
                  className="text-[var(--vdr-navy)] focus:ring-[var(--vdr-cyan)]"
                />
                <span>Skip existing items (Only import brand new models)</span>
              </label>
            </div>
          </div>

          {/* Preview Table */}
          <div className="rounded-md border border-[var(--vdr-border)] overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs text-[var(--vdr-text-primary)]">
                <thead className="bg-[var(--vdr-surface-subtle)] border-b border-[var(--vdr-border)] font-semibold text-slate-600 sticky top-0">
                  <tr className="h-9">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Product Title</th>
                    <th className="py-2 px-3">Brand</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">SKU / Model</th>
                    <th className="py-2 px-3">Action</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewData.rows.map((row) => (
                    <tr
                      key={row.rowNumber}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        row.status === 'error' ? 'bg-red-50/40' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px] tabular-nums">{row.rowNumber}</td>
                      <td className="py-2.5 px-3 font-medium max-w-xs">
                        <p className="truncate">{row.normalized.name || '—'}</p>
                        {row.errors.length > 0 && (
                          <p className="text-[10px] text-red-600 font-semibold pt-0.5">{row.errors.join(', ')}</p>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{row.normalized.brandId}</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.normalized.categoryId}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 tabular-nums">
                        {row.normalized.sku || row.normalized.model || '—'}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.isUpdate ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {row.isUpdate ? 'Update' : 'New Insert'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.status === 'valid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {row.status === 'valid' ? 'Valid' : 'Error'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Commit Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Ready to write <span className="font-bold text-[var(--vdr-text-primary)] tabular-nums">{previewData.validCount} valid items</span> directly into the SQLite database.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="px-3.5 py-2 rounded-md border border-[var(--vdr-border)] hover:bg-slate-50 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={committing || previewData.validCount === 0}
                onClick={handleCommit}
                className="px-5 py-2 rounded-md bg-[var(--vdr-navy)] hover:bg-[var(--vdr-navy-hover)] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {committing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Importing into Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--vdr-cyan)]" />
                    <span>Execute Import ({previewData.validCount} Items)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
