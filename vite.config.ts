import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // SEO and performance optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils/storage.ts', './src/utils/sound.ts', './src/utils/gemini.ts'],
        },
      },
    },
    // Enable minification and optimization
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Generate source maps for production debugging
    sourcemap: true,
  },
  // Configure asset handling
  assetsInclude: ['**/*.{png,jpg,gif,svg,webp}'],
  // Enable compression
  server: {
    compression: true,
  },
});