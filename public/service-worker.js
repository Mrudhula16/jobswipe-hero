
// Service Worker for JobSwipe App - Enhanced Version

const CACHE_NAME = 'jobswipe-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  // CSS, JS files will be added by the build process
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Force service worker activation
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of clients immediately
  self.clients.claim();
});

// Helper function to determine if a request is an API call
const isApiRequest = (request) => {
  return request.url.includes('/api/') || 
         request.url.includes('.supabase.co') || 
         request.url.includes('functions.io');
};

// Helper for determining if a request is for a static asset
const isStaticAsset = (request) => {
  const url = new URL(request.url);
  return STATIC_ASSETS.includes(url.pathname) || 
         url.pathname.startsWith('/icons/') ||
         url.pathname.startsWith('/assets/');
};

// Fetch event - network-first for API requests, cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For GET requests only
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  
  event.respondWith(
    (async () => {
      // For API requests: Network-first strategy
      if (isApiRequest(event.request)) {
        try {
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log('Fetch failed; returning offline page instead.', error);
          
          // If API call fails, show offline page for HTML requests
          if (event.request.headers.get('Accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
          
          return new Response(JSON.stringify({ error: 'Network connection lost' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          });
        }
      }
      
      // For static assets: Cache-first strategy
      if (isStaticAsset(event.request)) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
      
      // For other requests: Cache-first, then network
      try {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, get from network
        const networkResponse = await fetch(event.request);
        
        // Check if response is valid
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the response
        const responseToCache = networkResponse.clone();

        // Cache the response for future
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      } catch (error) {
        console.log('Fetch failed; returning offline page instead.', error);
        
        // If fetch fails, show offline page for HTML requests
        if (event.request.headers.get('Accept').includes('text/html')) {
          return caches.match(OFFLINE_URL);
        }
        
        // For non-HTML requests, return a simple error response
        return new Response('Network error occurred', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New notification from JobSwipe',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'JobSwipe Notification', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
