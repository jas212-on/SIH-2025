import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client']
  },
  server: {
    port: 3001,
    strictPort: false,
    host: true,
    proxy: {
      '/chat': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
    hmr: {
      clientPort: 3001,
      host: 'localhost',
      protocol: 'ws'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
