const express = require('express');
const authRouter = require('./src/routes/authRoutes');
const userRouter = require('./src/routes/userRoutes');
const {
  invalidRouteErrorMiddleware,
  globalErrorCatcher,
} = require('./src/common/middlewares');

const app = express();

// Create json object using the request data
app.use(express.json());

app.use('/api/v1', authRouter);
app.use('/api/v1/users', userRouter);

// triggers on invalid route definition is called.
app.all('*', invalidRouteErrorMiddleware);

// catch all the application errors here.
app.use(globalErrorCatcher);

module.exports = app;
