
import React from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from './context';

// Import styles
import './index.css';

// Preload critical assets
const preloadAssets = () => {
  // Preload critical images and fonts
  const preloadLinks = [
    { href: '/src/App.tsx', as: 'script' },
    { href: '/src/index.css', as: 'style' }
  ];
  
  preloadLinks.forEach(link => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = link.as;
    preloadLink.href = link.href;
    document.head.appendChild(preloadLink);
  });
};

// Run preload in background
preloadAssets();

// Use dynamic import for better initial loading with smaller initial bundle
const App = React.lazy(() => import('./App.tsx'));

// Loading state while app is loading with better UX
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading QRito...</p>
    </div>
  </div>
);

// Make sure we have a valid DOM element to render into
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Render with Suspense for better UX during loading
// Use smaller timeout for the suspense to reduce perceived loading time
createRoot(rootElement).render(
  <React.StrictMode>
    <UserProvider>
      <React.Suspense fallback={<LoadingState />}>
        <App />
      </React.Suspense>
    </UserProvider>
  </React.StrictMode>
);
