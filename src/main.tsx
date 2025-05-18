
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
import('./App.tsx').then(module => {
  const App = module.default;
  
  // Make sure we have a valid DOM element to render into
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Failed to find the root element");
  
  // Render immediately without Suspense to eliminate loading screen
  createRoot(rootElement).render(
    <React.StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </React.StrictMode>
  );
}).catch(error => {
  console.error("Error loading app:", error);
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-red-50"><div class="text-center"><p class="text-red-600">Error loading application. Please refresh the page.</p></div></div>';
  }
});
