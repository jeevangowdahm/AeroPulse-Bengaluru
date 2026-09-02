import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AeroPulse Bengaluru — Environmental Intelligence, Early Warning & Risk Platform',
  description: 'Real-time air quality monitoring, ML forecasting, 0-100 exposure risk engine, and source apportionment for the Bengaluru Urban Region.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased bg-slate-950 text-slate-900 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
