const { GenerateSW } = require('workbox-webpack-plugin');

const publicUrl = process.env.PUBLIC_URL || '';
const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

let apiOrigin = 'http://localhost:8000';
try {
  apiOrigin = new URL(apiBaseUrl).origin;
} catch {
  // keep default
}

const escapedApiOrigin = apiOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const apiCachePattern = new RegExp(`${escapedApiOrigin}/api/.*`, 'i');
const sameOriginApiPattern = /^\/api\//;

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        webpackConfig.plugins.push(
          new GenerateSW({
            clientsClaim: true,
            skipWaiting: false,
            cleanupOutdatedCaches: true,
            navigateFallback: `${publicUrl}/index.html`,
            navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
            additionalManifestEntries: [
              { url: `${publicUrl}/offline.html`, revision: '1' },
            ],
            runtimeCaching: [
              {
                urlPattern: apiCachePattern,
                method: 'GET',
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache',
                  networkTimeoutSeconds: 10,
                  expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 5 * 60,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: sameOriginApiPattern,
                method: 'GET',
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache-same-origin',
                  networkTimeoutSeconds: 10,
                  expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 5 * 60,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: ({ request }) => request.destination === 'image',
                handler: 'CacheFirst',
                options: {
                  cacheName: 'image-cache',
                  expiration: {
                    maxEntries: 80,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: ({ request }) =>
                  request.destination === 'style' ||
                  request.destination === 'script' ||
                  request.destination === 'font',
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'static-resources',
                  expiration: {
                    maxEntries: 48,
                    maxAgeSeconds: 7 * 24 * 60 * 60,
                  },
                },
              },
            ],
          })
        );
      }
      return webpackConfig;
    },
  },
};
