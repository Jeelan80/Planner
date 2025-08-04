import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '10.70.149.66',
    port: 4000,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
