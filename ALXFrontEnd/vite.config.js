import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,  // Disable sourcemaps entirely to avoid the related errors
    rollupOptions: {
      external: [
        'fs/promises', 'fs', 'path', 'os', 'stream', 'zlib', 'crypto', 'events', 'http', 'https', 'url', 'net', 'tls'
      ],
      output: {
        globals: {
          fs: 'fs',
          path: 'path',
          os: 'os',
        },
      },
    },
    chunkSizeWarningLimit: 1000,  // Increase chunk size limit to suppress warnings
  },
})

