import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import containerRoutes from './routes/containerRoutes';
import cargoRoutes from './routes/cargoRoutes';
import transportRoutes from './routes/transportRoutes';
import financeRoutes from './routes/financeRoutes';
import contractRoutes from './routes/contractRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import partnerRoutes from './routes/partnerRoutes';
import staffRoutes from './routes/staffRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: '🚛 Logistics API Backend',
    version: '1.0.0',
    endpoints: {
      containers: '/api/containers',
      cargo: '/api/cargo',
      transport: '/api/transport',
      finance: '/api/finance',
      contracts: '/api/contracts',
      invoices: '/api/invoices',
      partners: '/api/partners',
      staff: '/api/staff'
    }
  });
});

app.use('/api/containers', containerRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/staff', staffRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found',
    path: req.path 
  });
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📦 API Endpoints:`);
  console.log(`   GET  /api/containers`);
  console.log(`   GET  /api/cargo`);
  console.log(`   GET  /api/transport`);
  console.log(`   GET  /api/finance`);
  console.log(`   GET  /api/contracts`);
  console.log(`   GET  /api/invoices`);
  console.log(`   GET  /api/partners`);
  console.log(`   GET  /api/staff`);
});

export default app;