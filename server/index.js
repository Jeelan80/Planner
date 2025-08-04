import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import planRouter from './routes/plan.ts';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('🔧 Backend starting...');
console.log('📍 Environment:', {
  REACT_APP_NETWORK_HOST: process.env.REACT_APP_NETWORK_HOST,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Not set'
});

// Restrict access to only requests from allowed IP
const allowedIp = process.env.REACT_APP_NETWORK_HOST || '127.0.0.1';

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} from ${req.socket.remoteAddress}`);
  // Get remote IP (handle IPv4/IPv6)
  const remoteIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
  // Normalize IPv6 localhost
  const normalizedIp = remoteIp === '::1' ? '127.0.0.1' : remoteIp?.replace('::ffff:', '');
  if (normalizedIp !== allowedIp && allowedIp !== '0.0.0.0') {
    console.log(`❌ Access denied for IP: ${normalizedIp} (allowed: ${allowedIp})`);
    return res.status(403).json({ error: 'Access denied: Your IP is not allowed.' });
  }
  next();
});

// Mount the /generate-plan route
app.use('/', planRouter);

const PORT = process.env.PORT || 4000;
const HOST = process.env.REACT_APP_NETWORK_HOST || '0.0.0.0';

console.log(`🚀 Starting server on ${HOST}:${PORT}...`);

app.listen(PORT, HOST, () => {
  console.log(`✅ Backend server running: http://${HOST}:${PORT}`);
  console.log(`🔒 Allowed access from: ${allowedIp}`);
  console.log(`📡 Ready to handle requests!`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} is in use. Try a different port.`);
  }
  if (err.code === 'EADDRNOTAVAIL') {
    console.log(`💡 IP ${HOST} is not available. Check your network configuration.`);
  }
});
