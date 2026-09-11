// src/app/admin/products/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductEditorForm from '@/components/admin/ProductEditorForm';
import { AlertCircle } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-2">
        <div className="h-7 w-7 rounded-full border-2 border-[#0284C7] border-t-transparent animate-spin" />
        <span className="text-xs text-slate-500">Loading product editor...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center space-y-2">
        <AlertCircle className="h-6 w-6 text-red-600 mx-auto" />
        <h3 className="text-sm font-bold text-red-900">Product Not Found</h3>
        <p className="text-xs text-red-700">{error || 'Could not locate the requested product record.'}</p>
      </div>
    );
  }

  return <ProductEditorForm initialData={product} productId={id} />;
}
