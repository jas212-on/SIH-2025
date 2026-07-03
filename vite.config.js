import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'react-i18next',
      'i18next',
      'chart.js',
      'react-chartjs-2',
      'lucide-react',
      'react-simple-maps',
    ],
  },
  server: {
    port: 3001,
    strictPort: false,
    host: true,
    // No dev-server proxy: api.js always calls the backend via an absolute VITE_API_URL,
    // and proxy paths like '/chat' and '/visualization' collided with our own SPA routes,
    // breaking hard navigation/refresh on those pages.
    hmr: {
      clientPort: 3001,
      host: 'localhost',
      protocol: 'ws',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react:    ['react', 'react-dom'],
          charts:   ['chart.js'],
          maps:     ['react-simple-maps'],
          i18n:     ['react-i18next', 'i18next'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})

