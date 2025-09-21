import express, { json } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
import dashrouter from './routes/reportRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  allowedHeaders: ['Content-Type', 'Authorization'], 
  methods: ['GET', 'POST', 'OPTIONS'], 
  credentials: true, 
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/server/auth', authRouter);
app.use('/user', dashrouter);

app.listen(PORT, () => console.log(`Server running at ${PORT}`));