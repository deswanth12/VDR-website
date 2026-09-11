// src/app/page.tsx
'use client';

import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import SmartDiscoverySection from '@/components/home/SmartDiscoverySection';
import CatalogueSection from '@/components/catalogue/CatalogueSection';
import BrandsSection from '@/components/home/BrandsSection';
import SparesTradeSection from '@/components/home/SparesTradeSection';
import ServicesOverviewSection from '@/components/home/ServicesOverviewSection';
import ShowroomInfo from '@/components/home/ShowroomInfo';
import FinalCTASection from '@/components/home/FinalCTASection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero with Local Positioning, AC Tonnage Guide, and Showroom CTAs */}
      <HeroSection />

      {/* 2. Smart Product Discovery (Find AC, Spares, Washing Machine, Brands) */}
      <SmartDiscoverySection />

      {/* 3. Interactive Product Catalogue & Filter Grid */}
      <CatalogueSection initialCategory="all" />

      {/* 4. Brand Showcase (Daikin, Lloyd, Mitsubishi Electric, Samsung) */}
      <BrandsSection />

      {/* 5. Dedicated AC Spares & Technician Trade Desk */}
      <SparesTradeSection />

      {/* 6. Verified Showroom Services & Support */}
      <ServicesOverviewSection />

      {/* 7. Physical Showroom Location, Interactive Map & Operating Hours */}
      <ShowroomInfo />

      {/* 8. Final Conversion CTA: Looking for a product? Talk to VDR */}
      <FinalCTASection />
    </div>
  );
}
