import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'itemManagement',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.jsx',
        './ItemList': './src/pages/ItemList/index.jsx',
        './ItemDetail': './src/pages/ItemDetail/index.jsx',
        './ItemCreate': './src/pages/ItemCreate/index.jsx',
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
    port: 3003,
  },
  preview: {
    port: 3003,
  },
});
