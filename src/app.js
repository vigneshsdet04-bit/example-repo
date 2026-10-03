'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRouter = require('./routes/health');
const infoRouter = require('./routes/info');
const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');
const filesRouter = require('./routes/files');
const jobsRouter = require('./routes/jobs');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Core Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging: 'combined' in production, 'dev' otherwise
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/health', healthRouter);
app.use('/', infoRouter);
app.use('/users', usersRouter);
app.use('/chats', chatsRouter);
app.use('/files', filesRouter);
app.use('/jobs', jobsRouter);

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
