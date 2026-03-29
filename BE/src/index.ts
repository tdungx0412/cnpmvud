import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import containerRoutes from './routes/containerRoutes';
import partnerRoutes from './routes/partnerRoutes';

// Load env vars
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: '🚛 Logistics API Backend',
    version: '1.0.0'
  });
});

// Register routes
app.use('/api/containers', containerRoutes);
app.use('/api/partners', partnerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📦 Containers API: http://localhost:${PORT}/api/containers`);
  console.log(`👥 Partners API: http://localhost:${PORT}/api/partners`);
});

export default app;