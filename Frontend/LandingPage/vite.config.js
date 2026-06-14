import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'landingPage',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.jsx',
        './Home': './src/pages/Home/index.jsx',
        './About': './src/pages/About/index.jsx',
        './Login': './src/pages/Login/index.jsx',
        './Register': './src/pages/Register/index.jsx',
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
    port: 3001,
  },
  preview: {
    port: 3001,
  },
});
