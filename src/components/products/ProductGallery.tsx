// src/components/products/ProductGallery.tsx
'use client';

import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isDemo?: boolean;
}

export default function ProductGallery({
  images,
  productName,
  isDemo = true,
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>(images[0] || '');

  return (
    <div className="space-y-3">
      {/* Primary 4:3 Image Viewport */}
      <div className="relative aspect-4/3 w-full bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-xs">
        <img
          src={activeImage}
          alt={productName}
          className="max-h-full max-w-full object-contain transition-all duration-300"
        />

        {isDemo && (
          <span className="absolute bottom-3 right-3 text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-slate-500 border border-slate-200 px-2 py-1 rounded shadow-2xs">
            Demo Preview Image
          </span>
        )}
      </div>

      {/* Thumbnail Bar if multiple images exist */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`h-16 w-16 rounded-xl border p-1 bg-white shrink-0 transition-all cursor-pointer ${
                activeImage === img
                  ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="h-full w-full object-contain rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
