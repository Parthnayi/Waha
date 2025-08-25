// src/app.ts
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';
import contactsRoutes from './routes/contacts.routes.js';
import chatGroupsRoutes from './routes/chatgroups.routes.js';
import messagesRoutes from './routes/messages.routes.js';

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/chat-groups', chatGroupsRoutes);
app.use('/api/messages', messagesRoutes);

export default app;
