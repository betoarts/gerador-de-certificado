const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const { initDatabase } = require('./config/database');
const uploadController = require('./controllers/uploadController');
const certificateController = require('./controllers/certificateController');
const validationController = require('./controllers/validationController');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure directories exist
const dirs = ['uploads', 'outputs', 'assets'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Initialize database
initDatabase();

// CORS – allow configured origin or all in production
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173', 'http://localhost:5174'];
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/api/upload', uploadController);
app.use('/api/certificates', certificateController);
app.use('/api/validate', validationController);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Serve built React app in production
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // Catch-all: let React Router handle client-side routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🎓 Certificado Generator Backend`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
