import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const bffUrl = env.VITE_API_BASE_URL || 'http://localhost:4000';
  const landingPageUrl = env.VITE_LANDING_PAGE_URL || 'http://localhost:3001';
  const dashboardUrl = env.VITE_DASHBOARD_URL || 'http://localhost:3002';
  const itemManagementUrl = env.VITE_ITEM_MANAGEMENT_URL || 'http://localhost:3003';

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes: {
          landingPage: `${landingPageUrl}/assets/remoteEntry.js`,
          dashboard: `${dashboardUrl}/assets/remoteEntry.js`,
          itemManagement: `${itemManagementUrl}/assets/remoteEntry.js`,
        },
        shared: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
      }),
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: bffUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
