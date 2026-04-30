import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import campaignRoutes from './src/routes/campaigns.js';
import authRoutes from './src/routes/auth.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Marketing Email API is running' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
