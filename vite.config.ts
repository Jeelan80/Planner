import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const networkHost = env.REACT_APP_NETWORK_HOST || '127.0.0.1';
  const backendUrl = `http://${networkHost}:4000`;
  
  return {
    plugins: [react()],
    server: {
      host: networkHost,
      port: 3000, // Frontend on port 3000
      proxy: {
        // Proxy API calls to backend
        '/generate-plan': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
