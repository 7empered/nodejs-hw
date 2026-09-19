import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors as celebrateErrors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/authRoutes.js';
import notesRouter from './routes/notesRoutes.js';
import userRouter from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();

  const app = express();

  // Middleware
  app.use(logger);
  app.use(express.json());
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());

  // Routes
  app.use(authRouter);
  app.use(notesRouter);
  app.use(userRouter);

  // celebrate validation errors
  app.use(celebrateErrors());

  // 404 handler - must be after all valid routes
  app.use(notFoundHandler);

  // Error handler - must be the last middleware in the stack
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
