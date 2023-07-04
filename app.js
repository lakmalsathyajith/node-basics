const express = require('express');
const authRouter = require('./src/routes/authRoutes');
const userRouter = require('./src/routes/userRoutes');

const app = express();

// Create json object using the request data
app.use(express.json());

/**
 *
 * Here include all the routes and app related middlewares
 */
app.use('/api/v1', authRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
