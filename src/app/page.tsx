'use client'

import { MapView } from '@/components/map/MapView';

export default function HomePage() {
  return (
    <main className="w-full h-full">
      <MapView
        center={[106.8456, -6.2088]} // Sesuaikan dengan lokasi yang benar
        zoom={12}
      />
    </main>
  );
}